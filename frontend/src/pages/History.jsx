import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import GraphLine from "../components/GraphLine";

const History = () => {
  const [selectVM, setSelectVM] = useState("VM1");
  const [fechasHistory, setFechasHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [ramHistory, setRamHistory] = useState([]);

  const listVM = [
    { value: "VM1", label: "Maquina Virtual 1" },
    { value: "VM2", label: "Maquina Virtual 2" },
    { value: "VM3", label: "Maquina Virtual 3" },
    { value: "VM4", label: "Maquina Virtual 4" },
  ];
  const API_NODE_URL = process.env.REACT_APP_API_URL;

  const loadDataHistory = async () => {
    try {
      const response = await fetch(`${API_NODE_URL}/dataHistory/${selectVM}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API.");
      }

      const data = await response.json();

      const fechas = data.map(item => item.fecha);
      const ram = data.map(item => item.ram);
      const cpu = data.map(item => item.cpu);

      setFechasHistory(fechas);
      setRamHistory(ram);
      setCpuHistory(cpu);

      console.log(fechas)
      console.log(ram)
      console.log(cpu)

 
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    setSelectVM(valueSelect);
  };

  useEffect(() => {   
    loadDataHistory();
  }, []);

  return (
    <div className="d-flex justify-content-center py-4">
      <div className="card col-10  shadow-lg mb-5 bg-white rounded">
        <div className="card-body">
          <div className="row d-flex justify-content-center">
          <h3>Historial</h3>
            <div className="col-5 my-2">
              <Form.Select
                aria-label="Default select example"
                onChange={handleSelectChange}
              >
                <option>Seleccione maquina virtual</option>
                {listVM.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className="my-4">
            <div className="d-inline-block col-6">
              <GraphLine title="Porcentaje de uso RAM" color="orange" dates={fechasHistory} dataHistory={ramHistory}/>
            </div>

            <div className="d-inline-block col-6" >
              <GraphLine title="Porcentaje de uso CPU" color="green" dates={fechasHistory} dataHistory={cpuHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
