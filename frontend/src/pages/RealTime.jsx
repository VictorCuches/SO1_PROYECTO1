import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Table from '../components/TableData.jsx'; 

const RealTime = () => {
  const [processVM, setProcessVM] = useState([])


  const API_NODE_URL = process.env.REACT_APP_API_URL;

  const loadProcessVM = async () => {
    try {
      const response = await fetch(`${API_NODE_URL}/infoCpu`);

      if (!response.ok) {
        throw new Error('No se pudo obtener la respuesta de la API.');
      }

      const data = await response.json();
      setProcessVM(data.Procesos) 
    } catch (error) { 
      console.log(error.message)
    }
  }

  const prueba = async () => {
    try {
      const response = await fetch(`${API_NODE_URL}/prueba`);

      if (!response.ok) {
        throw new Error('No se pudo obtener la respuesta de la API.');
      }

      const data = await response.json();
      console.log(data)
    } catch (error) { 
      console.log(error.message)
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-7 bg-secondary'>
          <h1>Maquinas Virtuales</h1> 
          <Form.Select aria-label="Default select example">
            <option>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>

          <h3>Procesos</h3>
          <button onClick={loadProcessVM}>Cargar Procesos</button>
          <button onClick={prueba}>Historial MySQL</button>
          
          <Table
            data={processVM}
          />                  
              
        </div>
        <div className='col-5 bg-warning'>
          <h1>Graficas</h1>
        </div>
      </div>
      
    </div>
  )
}

export default RealTime