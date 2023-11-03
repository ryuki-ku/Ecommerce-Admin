"use client"

import { formatter } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data: any[]
};

export const Overview: React.FC<OverviewProps> = ({
    data
  }) => {
    return (
      <ResponsiveContainer width="100%" height='100%' >
        <BarChart data={data} 
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <XAxis
            dataKey="name"
            stroke="#000a00"
            fontSize={11.5}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#000a00"
            fontSize={11.5}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${formatter.format(value)}VND`}
          />
          {/* Display total revenue in each month */}
          <Bar dataKey="total" fill="#3498db" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  };