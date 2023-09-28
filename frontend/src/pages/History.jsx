import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import GraphLine from "../components/GraphLine";

const History = () => {
  const [selectVM, setSelectVM] = useState("");

  const listVM = [
    { value: "VM1", label: "Maquina Virtual 1" },
    { value: "VM2", label: "Maquina Virtual 2" },
    { value: "VM3", label: "Maquina Virtual 3" },
    { value: "VM4", label: "Maquina Virtual 4" },
  ];

  const handleSelectChange = (event) => {
    const valueSelect = event.target.value;
    setSelectVM(valueSelect);
  };

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
              <GraphLine title="Porcentaje de uso RAM" color="orange"/>
            </div>

            <div className="d-inline-block col-6" >
              <GraphLine title="Porcentaje de uso CPU" color="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
