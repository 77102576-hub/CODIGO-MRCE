import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER = 'wss://broker.emqx.io:8084/mqtt';

// Componente del Diagrama Unifilar
function SingleLineDiagram({ systemState, onToggleBreaker }) {
  const getColor = (status) => (status ? '#ef4444' : '#6b7280');

  return (
    <div className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-white">
      <h2 className="text-xl font-bold mb-1">Diagrama Unifilar - Sistema IEEE 9 Buses</h2>
      <p className="text-xs text-slate-400 mb-4">Haz clic en los interruptores (cuadros) para accionar el ESP32 vía Wi-Fi</p>

      <svg viewBox="0 0 900 650" className="w-full h-auto max-w-4xl">
        {/* BUSES */}
        <line x1="400" y1="560" x2="500" y2="560" stroke="#3b82f6" strokeWidth="6" />
        <text x="360" y="565" fill="#3b82f6" fontWeight="bold" fontSize="14">Bus 1</text>

        <line x1="120" y1="260" x2="120" y2="360" stroke="#22c55e" strokeWidth="6" />
        <text x="65" y="320" fill="#22c55e" fontWeight="bold" fontSize="14">Bus 2</text>

        <line x1="780" y1="260" x2="780" y2="360" stroke="#eab308" strokeWidth="6" />
        <text x="795" y="320" fill="#eab308" fontWeight="bold" fontSize="14">Bus 3</text>

        <line x1="300" y1="480" x2="600" y2="480" stroke={getColor(systemState.lines['4-5'])} strokeWidth="5" />
        <text x="250" y="485" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 4</text>

        <line x1="250" y1="360" x2="380" y2="360" stroke={getColor(systemState.lines['4-5'])} strokeWidth="5" />
        <text x="200" y="365" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 5</text>

        <line x1="520" y1="360" x2="650" y2="360" stroke={getColor(systemState.lines['4-6'])} strokeWidth="5" />
        <text x="470" y="365" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 6</text>

        <line x1="280" y1="200" x2="380" y2="200" stroke={getColor(systemState.lines['5-7'])} strokeWidth="5" />
        <text x="230" y="205" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 7</text>

        <line x1="420" y1="120" x2="580" y2="120" stroke={getColor(systemState.lines['7-8'])} strokeWidth="5" />
        <text x="485" y="145" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 8</text>

        <line x1="520" y1="200" x2="620" y2="200" stroke={getColor(systemState.lines['8-9'])} strokeWidth="5" />
        <text x="630" y="205" fill="#ef4444" fontWeight="bold" fontSize="12">Bus 9</text>

        {/* LÍNEAS DE TRANSMISIÓN */}
        <line x1="350" y1="480" x2="350" y2="360" stroke={getColor(systemState.lines['4-5'])} strokeWidth="3" />
        <line x1="550" y1="480" x2="550" y2="360" stroke={getColor(systemState.lines['4-6'])} strokeWidth="3" />
        <line x1="300" y1="360" x2="300" y2="200" stroke={getColor(systemState.lines['5-7'])} strokeWidth="3" />
        <line x1="600" y1="360" x2="600" y2="200" stroke={getColor(systemState.lines['6-9'])} strokeWidth="3" />
        <line x1="300" y1="200" x2="450" y2="120" stroke={getColor(systemState.lines['7-8'])} strokeWidth="3" />
        <line x1="550" y1="120" x2="600" y2="200" stroke={getColor(systemState.lines['8-9'])} strokeWidth="3" />

        {/* GENERADORES */}
        <circle cx="450" cy="610" r="18" fill="none" stroke="#22c55e" strokeWidth="3" />
        <text x="444" y="615" fill="#22c55e" fontWeight="bold">G1</text>
        <line x1="450" y1="592" x2="450" y2="560" stroke="#3b82f6" strokeWidth="3" />

        <circle cx="50" cy="310" r="18" fill="none" stroke="#22c55e" strokeWidth="3" />
        <text x="44" y="315" fill="#22c55e" fontWeight="bold">G2</text>
        <line x1="68" y1="310" x2="120" y2="310" stroke="#22c55e" strokeWidth="3" />

        <circle cx="850" cy="310" r="18" fill="none" stroke="#22c55e" strokeWidth="3" />
        <text x="844" y="315" fill="#22c55e" fontWeight="bold">G3</text>
        <line x1="832" y1="310" x2="780" y2="310" stroke="#eab308" strokeWidth="3" />

        {/* TRANSFORMADORES */}
        <circle cx="450" cy="510" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="450" cy="525" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="180" cy="250" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="195" cy="250" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="720" cy="250" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />
        <circle cx="705" cy="250" r="12" fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* CARGAS */}
        <polygon points="325,400 335,400 330,412" fill={getColor(systemState.loads.loadA)} />
        <text x="315" y="425" fill="#f87171" fontSize="10" fontWeight="bold">Load A</text>

        <polygon points="615,400 625,400 620,412" fill={getColor(systemState.loads.loadB)} />
        <text x="605" y="425" fill="#f87171" fontSize="10" fontWeight="bold">Load B</text>

        <polygon points="495,70 505,70 500,58" fill={getColor(systemState.loads.loadC)} />
        <text x="485" y="50" fill="#f87171" fontSize="10" fontWeight="bold">Load C</text>

        {/* INTERRUPTORES */}
        <rect x="323" y="372" width="14" height="14" fill={getColor(systemState.loads.loadA)} stroke="#ffffff" strokeWidth="1" className="cursor-pointer" onClick={() => onToggleBreaker('loads', 'loadA')} />
        <rect x="613" y="372" width="14" height="14" fill={getColor(systemState.loads.loadB)} stroke="#ffffff" strokeWidth="1" className="cursor-pointer" onClick={() => onToggleBreaker('loads', 'loadB')} />
        <rect x="493" y="85" width="14" height="14" fill={getColor(systemState.loads.loadC)} stroke="#ffffff" strokeWidth="1" className="cursor-pointer" onClick={() => onToggleBreaker('loads', 'loadC')} />
      </svg>
    </div>
  );
}

// Aplicación Principal SCADA
export default function Dashboard() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [systemState, setSystemState] = useState({
    telemetry: { voltageBus5: 0.98, frequency: 60.0, totalPowerMW: 125.4 },
    loads: { loadA: true, loadB: true, loadC: true },
    lines: { '4-5': true, '4-6': true, '5-7': true, '6-9': true, '7-8': true, '8-9': true }
  });

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER);

    mqttClient.on('connect', () => {
      setIsConnected(true);
      mqttClient.subscribe('esp32/9bus/telemetry');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        setSystemState(prev => ({ ...prev, telemetry: payload }));
      } catch (e) {
        console.error(e);
      }
    });

    setClient(mqttClient);
    return () => mqttClient.end();
  }, []);

  const handleToggleBreaker = (category, item) => {
    const updatedStatus = !systemState[category][item];
    setSystemState(prev => ({
      ...prev,
      [category]: { ...prev[category], [item]: updatedStatus }
    }));

    if (client && isConnected) {
      client.publish(`esp32/9bus/control/${item}`, JSON.stringify({ state: updatedStatus }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center font-sans">
      <header className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-indigo-400">SCADA Cloud IoT - 9 Bus System</h1>
          <p className="text-xs text-slate-400">Monitoreo & Control en Tiempo Real</p>
        </div>
        <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? '● MQTT Conectado' : '○ Desconectado'}
        </span>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Frecuencia</p>
          <p className="text-2xl font-bold text-emerald-400">{systemState.telemetry.frequency} Hz</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Tensión Bus 5</p>
          <p className="text-2xl font-bold text-blue-400">{systemState.telemetry.voltageBus5} p.u.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Demanda Total</p>
          <p className="text-2xl font-bold text-amber-400">{systemState.telemetry.totalPowerMW} MW</p>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <SingleLineDiagram systemState={systemState} onToggleBreaker={handleToggleBreaker} />
      </div>
    </div>
  );
}
