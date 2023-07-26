import {db} from "@/lib/db";

interface GraphData {
    name: string
    value: number
}

export const getGraphData = async (storeId: string) => {
    const paidOrders = await db.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    const monthlyIncome: {[key: string]: number} = {}

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth()
        const income = order.items.reduce((acc, item) => {
            return acc + item.product.price.toNumber()
        }, 0)

        if (monthlyIncome[month]) {
            monthlyIncome[month] += income
        } else {
            monthlyIncome[month] = income
        }
    }

    const graphData: GraphData[] = [
        {name: "Jan", value:  0},
        {name: "Feb", value:  0},
        {name: "Mar", value:  0},
        {name: "Apr", value:  0},
        {name: "May", value:  0},
        {name: "Jun", value:  0},
        {name: "Jul", value:  0},
        {name: "Aug", value:  0},
        {name: "Sep", value:  0},
        {name: "Oct", value:  0},
        {name: "Nov", value:  0},
        {name: "Dec", value:  0},
    ]

    for (const month in monthlyIncome) {
        graphData[parseInt(month)].value = monthlyIncome[month]
    }

    return graphData
}
