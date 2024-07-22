import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RoyaltyCalculator = () => {
  const [params, setParams] = useState({
    initialInvest: 200,
    initialRevenue: 1000,
    revenueGrowth: 75,
    maxReturnMultiple: 3,
    annualInterestRate: 15
  });

  const [data, setData] = useState([]);
  const [maxRoyalties, setMaxRoyalties] = useState(0);
  const [effectiveRoyaltyRate, setEffectiveRoyaltyRate] = useState(0);

  const calculateRoyalties = () => {
    let currentRevenue = params.initialRevenue;
    let cumulativeCashflow = -params.initialInvest;
    let totalRoyalties = 0;
    let outstandingInvestment = params.initialInvest;
    const newData = [];

    const quarterlyInterestRate = Math.pow(1 + params.annualInterestRate / 100, 0.25) - 1;
    const quarterlyRevenueGrowthRate = Math.pow(1 + params.revenueGrowth / 100, 0.25) - 1;

    const maxRoyalties = params.initialInvest * (params.maxReturnMultiple - 1);
    setMaxRoyalties(maxRoyalties);

    for (let year = 1; year <= 10; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterlyRevenue = currentRevenue / 4;
        const requiredReturn = outstandingInvestment * quarterlyInterestRate;
        const royaltyRate = requiredReturn / quarterlyRevenue;
        let royalties = Math.min(quarterlyRevenue * royaltyRate, quarterlyRevenue, maxRoyalties - totalRoyalties);

        if (royalties < 0) royalties = 0;

        totalRoyalties += royalties;
        outstandingInvestment -= (quarterlyRevenue - royalties);

        newData.push({
          name: `Year ${year} Q${quarter}`,
          Revenue: quarterlyRevenue,
          Royalties: royalties,
          'Outstanding Investment': outstandingInvestment
        });

        currentRevenue *= (1 + quarterlyRevenueGrowthRate);
      }
    }

    setData(newData);
    setEffectiveRoyaltyRate((totalRoyalties / params.initialRevenue) * 100);
  };

  useEffect(() => {
    calculateRoyalties();
  }, [params]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Royalties Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Initial Investment</Label>
          <Input type="number" value={params.initialInvest} onChange={e => setParams({ ...params, initialInvest: parseFloat(e.target.value) })} />
        </div>
        <div>
          <Label>Initial Revenue</Label>
          <Input type="number" value={params.initialRevenue} onChange={e => setParams({ ...params, initialRevenue: parseFloat(e.target.value) })} />
        </div>
        <div>
          <Label>Revenue Growth (%)</Label>
          <Input type="number" value={params.revenueGrowth} onChange={e => setParams({ ...params, revenueGrowth: parseFloat(e.target.value) })} />
        </div>
        <div>
          <Label>Max Return Multiple</Label>
          <Input type="number" value={params.maxReturnMultiple} onChange={e => setParams({ ...params, maxReturnMultiple: parseFloat(e.target.value) })} />
        </div>
        <div>
          <Label>Annual Interest Rate (%)</Label>
          <Input type="number" value={params.annualInterestRate} onChange={e => setParams({ ...params, annualInterestRate: parseFloat(e.target.value) })} />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="Royalties" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Outstanding Investment" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RoyaltyCalculator;
