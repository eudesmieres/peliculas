import React, { useState } from 'react';
import axios from 'axios';
import styles from './Form.module.css';

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedData, setImportedData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (event) => {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    if (selectedFile) {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      axios.post('http://localhost:3001/importarPeliculas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
          // Carga exitosa
          console.log('Imported:', response.data.importadas);
          setImportedData(response.data.importadas); // Actualiza el estado con los datos importados
        })
        .catch(error => {
          // Error de carga
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <input className={styles.input} type="file" accept=".csv" onChange={handleFileChange} />
      <button className={styles.button} onClick={handleUpload}>Subir</button>

      {importedData.length > 0 && (
        <div>
        <h2>Datos Importados</h2>
        <ul className={styles.list}>
          {importedData.map((fila, index) => { // map para mostrar los datos cargados en pantalla
            //console.log('----Fila:----', fila);
            return (
              <li key={index}>
                <strong>Título: </strong>
                <span className={styles.fila}>{fila.id}</span><br />
              </li>
            );
          })}
        </ul>
      </div>
      )}
    </div>
  );
};

export default Form;
