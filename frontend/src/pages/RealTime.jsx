import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "../components/TableData.jsx";
import GraphPie from "../components/GraphPie";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa el archivo CSS de Bootstrap Icons

const RealTime = () => {
  const [processVM, setProcessVM] = useState([]);
  const [porcentajeGraph, setPorcentajeGraph] = useState({cpu:0, ram: 0});
  const [textFilter, setTextFilter] = useState("");
  const [selectVM, setSelectVM] = useState("");

  const listVM = [
    { value: "VM1", label: "Maquina Virtual 1" },
    { value: "VM2", label: "Maquina Virtual 2" },
    { value: "VM3", label: "Maquina Virtual 3" },
    { value: "VM4", label: "Maquina Virtual 4" },
  ];

  const API_NODE_URL = process.env.REACT_APP_API_URL;

  const loadProcessVM = async () => {
    try {
      const response = await fetch(`${API_NODE_URL}/infoCpu`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();
      setProcessVM(data.Procesos);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadDataGraphs = async () => {
    console.log("loadDataGraphs")
    try {
      const response_ram = await fetch(`${API_NODE_URL}/infoRam`);
      if (!response_ram.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const response_cpu = await fetch(`${API_NODE_URL}/cpu_porcentaje`);
      if (!response_cpu.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data_ram = await response_ram.json();
      const data_cpu = await response_cpu.json();

      setPorcentajeGraph({cpu: data_cpu.sumaCPU, ram: data_ram.Porcentaje});

      console.log("selectVM",selectVM)
      const body = {
        "ram": data_ram.Porcentaje,
        "cpu": data_cpu.sumaCPU,
        "maquina": selectVM
      } 
      const response_history = await fetch(`${API_NODE_URL}/saveHistory`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      if (!response_history.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }
      const data_history = await response_history.json(); 
 
    } catch (error) {
      console.log(error.message);
    }
  }

  const killProcess = async () => {
    console.log(textFilter, selectVM);
    const body = {
      "pid_App": parseInt(textFilter)
    }
    try {
      const response = await fetch(`${API_NODE_URL}/killProcess`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }
      const data = await response.json();
      refresh();
    } catch (error) {
      console.log(error.message);
    }
  };

  const refresh = () => {
    setTextFilter("");
    loadDataGraphs();
    loadProcessVM();
  };

  const onChangePID = (event) => {
    const PID = event.target.value;
    setTextFilter(PID);
    const filteredProcessVM = processVM.filter((item) =>
      item.Pid.toString().includes(textFilter)
    );
    setProcessVM(filteredProcessVM);
  };

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    console.log("valueSelect", valueSelect)
    if(valueSelect === '') { return; }
    
    setSelectVM(valueSelect);
    console.log(selectVM);
    refresh()
  };

  const prueba = async () => {
    console.log(selectVM)
    // try {
    //   const response = await fetch(`${API_NODE_URL}/prueba`);
    //   if (!response.ok) {
    //     throw new Error("No se pudo obtener la respuesta de la API.");
    //   }
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  useEffect(() => {
    loadProcessVM();
    loadDataGraphs();

    const intervalId = setInterval(() => { 
      console.log("Actualizando graficas")
      loadDataGraphs();
    }, 30000); // 20000 milisegundos = 20 segundos
   
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <div className="row py-3">
        <div className="col-8">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h1>Maquinas Virtuales</h1>
              <Form.Select
                aria-label="Default select example"
                onChange={handleSelectChange}
                className="my-4"
              >
                <option>Seleccione maquina virtual</option>
                {listVM.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              <h3>Procesos</h3>
              {/* <button onClick={prueba}>Historial MySQL</button> */}
              <div className="d-flex align-items-center my-2">
                <input
                  className="form-control mr-2 "
                  placeholder="Ingrese PID"
                  value={textFilter}
                  onChange={onChangePID}
                />
                <button className="btn btn-danger" onClick={killProcess}>
                  <i className="bi bi-x-square"></i>
                </button>
                <button className="btn btn-primary ml-2" onClick={refresh}>
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
                <button className="btn btn-secondary ml-2" onClick={prueba}>
                  <i className="bi bi-question"></i>
                </button>
              </div>
              
              <div className="my-4">
                {processVM ? <Table data={processVM} /> : <p>Cargando...</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="card shadow-lg mb-5 bg-white rounded">
            <div className="card-body">
              <GraphPie title="Porcentaje de uso de RAM" usageValue={porcentajeGraph.ram}/>
              <GraphPie title="Porcentaje de uso de CPU" usageValue={porcentajeGraph.cpu}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTime;
