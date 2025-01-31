'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { BudgetCategory } from '@/types/budget'

interface BudgetTimelineProps {
  categories: BudgetCategory[]
  startDate: Date
}

interface Payment {
  categoryId: string
  categoryName: string
  amount: number
  dueDate: string
  type: 'deposit' | 'installment' | 'final'
}

interface ChartData {
  name: string
  total: number
  deposit: number
  final: number
}

// Sample payment data
const dummyPayments: Payment[] = [
  { categoryId: 'venue', categoryName: 'Venue', amount: 5000, dueDate: '2024-02-15', type: 'deposit' },
  { categoryId: 'catering', categoryName: 'Catering', amount: 3000, dueDate: '2024-03-01', type: 'deposit' },
  { categoryId: 'venue', categoryName: 'Venue', amount: 10000, dueDate: '2024-04-15', type: 'final' },
  { categoryId: 'photography', categoryName: 'Photography', amount: 2500, dueDate: '2024-05-01', type: 'deposit' },
  { categoryId: 'catering', categoryName: 'Catering', amount: 7000, dueDate: '2024-05-15', type: 'final' },
  { categoryId: 'flowers', categoryName: 'Flowers', amount: 3500, dueDate: '2024-06-01', type: 'final' },
  { categoryId: 'photography', categoryName: 'Photography', amount: 2500, dueDate: '2024-06-15', type: 'final' }
]

const BudgetTimeline: React.FC<BudgetTimelineProps> = ({ categories, startDate }) => {
  const [view, setView] = React.useState<'chart' | 'list'>('chart')

  // Group payments by month
  const payments = React.useMemo(() => {
    const allPayments: Payment[] = []
    
    if (categories.some(c => c.contracts?.length > 0)) {
      categories.forEach(category => {
        if (category.contracts) {
          category.contracts.forEach(contract => {
            allPayments.push({
              categoryId: category.id,
              categoryName: category.name,
              amount: contract.amount,
              dueDate: contract.date,
              type: contract.status === 'pending' ? 'deposit' : 'final'
            })
          })
        }
      })
    } else {
      // Use dummy data if no real contracts exist
      allPayments.push(...dummyPayments)
    }

    return allPayments.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  }, [categories])

  const chartData = React.useMemo(() => {
    const monthlyData: Record<string, ChartData> = {}
    
    payments.forEach(payment => {
      const month = new Date(payment.dueDate).toLocaleString('default', { month: 'short', year: '2-digit' })
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          total: 0,
          deposit: 0,
          final: 0
        }
      }
      
      monthlyData[month].total += payment.amount
      if (payment.type === 'deposit') {
        monthlyData[month].deposit += payment.amount
      } else {
        monthlyData[month].final += payment.amount
      }
    })

    return Object.values(monthlyData)
  }, [payments])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Timeline</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={view === 'chart' ? 'default' : 'outline'}
              onClick={() => setView('chart')}
              size="sm"
            >
              Chart
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
              size="sm"
            >
              List
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'chart' ? (
          <div className="h-[300px] sm:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: 'black' }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '20px',
                  }}
                />
                <Bar 
                  dataKey="deposit" 
                  stackId="a" 
                  fill="#94a3b8" 
                  name="Deposits" 
                />
                <Bar 
                  dataKey="final" 
                  stackId="a" 
                  fill="#738678" 
                  name="Final Payments" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ScrollArea className="h-[300px] sm:h-[350px]">
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div
                  key={`${payment.categoryId}-${index}`}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium">{payment.categoryName}</div>
                    <div className="text-sm text-sage-600">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(payment.amount)}</div>
                    <div className="text-sm text-sage-600">{payment.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default BudgetTimeline

