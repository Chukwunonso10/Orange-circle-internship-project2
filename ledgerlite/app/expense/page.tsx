import { getCurrentUserId } from "../lib/authhelper"
import prisma from "../lib/prisma"

export default async function Expense(){
    const userId = await getCurrentUserId()
    
    if(!userId){
        throw new Error("unauthorized user!")
    }
    const session = await prisma.session.findFirst({where: {userId}, include: {user: true}})

    const myname =  session?.user.firstName
    const allExpenses = await prisma.expense.findMany({
        where: {userId}
    })
    if(allExpenses){
        console.log(allExpenses)
    }
    return (
        <div className="text-2xl text-blue-500">
            <h1 className="absolute top-0 right-3">welcome {myname}</h1>
            <h1 className="absolute top-0 right-3"></h1>
            {Array.isArray(allExpenses) ? allExpenses.map((item)=>{
                return (
                    <div key={item.id} className="flex flex-col gap-2 items-center justify-center">
                       <p> id: {item.id}</p>
                       <p> category: {item.category}</p>
                        <p>description: {item.category}</p>
                        <p>date: {item.createdAt.toDateString()}</p>
                    </div>
                )
            }) : null}
        </div>
    )
}