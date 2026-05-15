import React from "react";

export default function Table({ columns, data }: { columns: string[]; data: any[] }) {
    return (
        <div className="overflow-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                        {columns.map((c) => (
                            <th key={c} className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300">
                                {c}
                            </th>
                        ))}
                        <th className="px-4 py-2" />
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                            {columns.map((col) => (
                                <td key={col} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{row[col.toLowerCase()]}</td>
                            ))}
                            <td className="px-4 py-3 text-right">
                                <button className="text-blue-600 dark:text-blue-400">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
