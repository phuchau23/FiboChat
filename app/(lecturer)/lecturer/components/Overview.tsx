"use client";

import React from "react";

export const Overview: React.FC = () => {
  return (
    <section className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#fa7a1c] to-orange-400 bg-clip-text text-transparent">
          AI Management Dashboard
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Monitor AI performance and student engagement for the free SWP392 intelligent support system.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            title: "AI Response Rate",
            value: "94.2%",
            description: "Questions answered automatically",
            change: "+5.2%",
          },
          {
            title: "Student Engagement",
            value: "87%",
            description: "Active students using AI support",
            change: "+12%",
          },
          {
            title: "Teacher Workload Reduction",
            value: "76%",
            description: "Time saved through AI automation",
            change: "+8%",
          },
          {
            title: "Student Satisfaction",
            value: "91.5%",
            description: "Positive feedback on AI responses",
            change: "+15%",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all p-5 border border-gray-100 flex flex-col gap-1"
          >
            <div className="text-[#fa7a1c] font-medium text-sm">{item.title}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-gray-500 text-sm">
              {item.description} <span className="text-[#fa7a1c] font-medium">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      {/* Lower panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-lg transition-all p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fa7a1c] to-orange-400 opacity-80"></div>
          <h3 className="text-lg font-semibold text-[#fa7a1c] mb-5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#fa7a1c]"></span>
            AI Performance Metrics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="py-2">Metric</th>
                  <th className="py-2 text-right">Value</th>
                  <th className="py-2 text-right">Last Update</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-orange-50/40 transition">
                  <td className="py-2 font-medium text-gray-800">AI Model Updated</td>
                  <td className="py-2 text-right">98%</td>
                  <td className="py-2 text-right text-gray-400">1h ago</td>
                </tr>
                <tr className="hover:bg-orange-50/40 transition">
                  <td className="py-2 font-medium text-gray-800">Knowledge Base Expanded</td>
                  <td className="py-2 text-right text-[#fa7a1c] font-semibold">+New</td>
                  <td className="py-2 text-right text-gray-400">Now</td>
                </tr>
                <tr className="hover:bg-orange-50/40 transition">
                  <td className="py-2 font-medium text-gray-800">Knowledge Base Sync</td>
                  <td className="py-2 text-right">100%</td>
                  <td className="py-2 text-right text-gray-400">3h ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Usage */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-lg transition-all p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fa7a1c] to-orange-400 opacity-80"></div>
          <h3 className="text-lg font-semibold text-[#fa7a1c] mb-5 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#fa7a1c]"></span>
            AI Service Usage & Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="py-2">Service</th>
                  <th className="py-2 text-right">Usage</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-orange-50/40 transition">
                  <td className="py-2 font-medium text-gray-800">NLP Engine</td>
                  <td className="py-2 text-right text-[#fa7a1c] font-semibold">92%</td>
                  <td className="py-2 text-right">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-[#fa7a1c] font-medium">
                      High
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-orange-50/40 transition">
                  <td className="py-2 font-medium text-gray-800">Knowledge Base Mgmt</td>
                  <td className="py-2 text-right text-[#fa7a1c] font-semibold">100%</td>
                  <td className="py-2 text-right">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      Operational
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
