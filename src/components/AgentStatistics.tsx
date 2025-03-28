import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Clock, Users, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
  TimeScale
);

// Mock data for statistics
const MOCK_STATS = {
  requestStatus: {
    new: 35,
    in_progress: 45,
    completed: 20,
    cancelled: 10
  },
  requestUrgency: {
    critical: 15,
    high: 25,
    medium: 40,
    low: 20
  },
  overallStats: {
    totalRequests: 110,
    avgResponseTime: 11,
    completionRate: 92,
    activeAgents: 12
  },
  agentPerformance: [
    { name: 'Sophie Martin', completed: 45, avgResponseTime: 8 },
    { name: 'Jean Dupont', completed: 38, avgResponseTime: 12 },
    { name: 'Marie Bernard', completed: 42, avgResponseTime: 10 },
    { name: 'Lucas Petit', completed: 35, avgResponseTime: 15 },
    { name: 'Emma Leroy', completed: 40, avgResponseTime: 9 }
  ],
  dailyStats: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString(),
      completedRequests: Math.floor(Math.random() * 20) + 10,
      newRequests: Math.floor(Math.random() * 15) + 5,
      activeAgents: Math.floor(Math.random() * 5) + 8
    };
  }).reverse()
};

export function AgentStatistics() {
  const [dateRange, setDateRange] = useState('week'); // 'week' | 'month' | 'year'

  const dailyActivityData = {
    datasets: [
      {
        label: 'Demandes complétées',
        data: MOCK_STATS.dailyStats.map(stat => ({
          x: new Date(stat.date),
          y: stat.completedRequests
        })),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Nouvelles demandes',
        data: MOCK_STATS.dailyStats.map(stat => ({
          x: new Date(stat.date),
          y: stat.newRequests
        })),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Agents actifs',
        data: MOCK_STATS.dailyStats.map(stat => ({
          x: new Date(stat.date),
          y: stat.activeAgents
        })),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const timelineOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: dateRange === 'week' ? 'day' : dateRange === 'month' ? 'week' : 'month',
          displayFormats: {
            day: 'dd MMM',
            week: 'dd MMM',
            month: 'MMM yyyy'
          },
          tooltipFormat: 'dd MMMM yyyy',
          adapters: {
            locale: fr
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre'
        }
      }
    }
  };

  const requestStatusData = {
    labels: ['Nouveaux', 'En cours', 'Complétés', 'Annulés'],
    datasets: [
      {
        data: [
          MOCK_STATS.requestStatus.new,
          MOCK_STATS.requestStatus.in_progress,
          MOCK_STATS.requestStatus.completed,
          MOCK_STATS.requestStatus.cancelled
        ],
        backgroundColor: [
          'rgb(59, 130, 246)', // blue
          'rgb(234, 179, 8)',  // yellow
          'rgb(34, 197, 94)',  // green
          'rgb(239, 68, 68)'   // red
        ]
      }
    ]
  };

  const requestUrgencyData = {
    labels: ['Critique', 'Haute', 'Moyenne', 'Basse'],
    datasets: [
      {
        data: [
          MOCK_STATS.requestUrgency.critical,
          MOCK_STATS.requestUrgency.high,
          MOCK_STATS.requestUrgency.medium,
          MOCK_STATS.requestUrgency.low
        ],
        backgroundColor: [
          'rgb(239, 68, 68)',   // red
          'rgb(234, 179, 8)',   // yellow
          'rgb(59, 130, 246)',  // blue
          'rgb(34, 197, 94)'    // green
        ]
      }
    ]
  };

  const performanceData = {
    labels: MOCK_STATS.agentPerformance.map(agent => agent.name),
    datasets: [
      {
        label: 'Demandes complétées',
        data: MOCK_STATS.agentPerformance.map(agent => agent.completed),
        backgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 8
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        textAlign: 'center' as const
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {MOCK_STATS.overallStats.totalRequests}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nouvelles Demandes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {MOCK_STATS.requestStatus.new}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {MOCK_STATS.requestStatus.in_progress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Complétés</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {MOCK_STATS.requestStatus.completed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Activité dans le temps</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="year">12 derniers mois</option>
            </select>
          </div>
        </div>
        <Line data={dailyActivityData} options={timelineOptions} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">État des Dossiers</h3>
          <div className="flex items-center justify-center" style={{ height: '300px' }}>
            <Doughnut
              data={requestStatusData}
              options={doughnutOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Niveau d'Urgence</h3>
          <div className="flex items-center justify-center" style={{ height: '300px' }}>
            <Doughnut
              data={requestUrgencyData}
              options={doughnutOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance des Agents</h3>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                datalabels: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Nombre de demandes complétées'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}