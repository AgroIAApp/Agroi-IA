/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../reusable/header/header';
import MapContainer from '../reusable/mapContainer/mapContainer';
import Icon from '../../assets/icons/icon';
import { fetchImage, get } from '../conexionBack/conexionBack';
import { createPolygonFromPlots } from '../reusable/map/funcionesMapa';
import Loader from '../reusable/loader/loader';
import ErrorModal from '../reusable/errorFolder/errores';

export default function EditarCampo() {
  const { field } = useParams();
  const { userID } = useParams();
  const [imageUrl, setImageUrl] = useState('');

  const [isLoading, setLoading] = useState(true);
  const [campo, setCampo] = useState(null);
  const [campoFeatures, setCampoFeatures] = useState(null);
  const [invalid, setinValid] = useState(false);
  const [errorMsg, setErrorMessage] = useState({ title: '', message: '' });

  const fetchData = async () => {
    const image = await fetchImage(field);
    setImageUrl(image);
  };

  const getField = async () => {
    try {
      const accessToken = `Bearer ${userID}`;
      const response = await get(`field/${field}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      setCampo(response);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage({
        title: 'Error de conexión',
        message: `Ocurrió un error en la conexión con el servidor. Detalles del error: ${error.message}`,
      });
      setinValid(true);
    }
  };

  useEffect(() => {
    getField();
    fetchData();
  }, [field]);

  useEffect(() => {
    // Update campo variable when userData changes
    if (campo && imageUrl) {
      setCampoFeatures(createPolygonFromPlots(campo));
      setLoading(false);
    }
  }, [campo, imageUrl]);

  const okay = () => {
    location.reload();
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header />
      {invalid && <ErrorModal title={errorMsg.title} message={errorMsg.message} onClick={okay} />}
      {isLoading ? ( // Show loader while loading data
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="agregar-campo-titulo">
            {' '}
            <Icon className="bi bi-pencil-square" color="#464E47" fontSize="" />
            {' '}
            INFORMACION DEL CAMPO:
            {' '}
            {campo.name}
          </h1>
          <MapContainer
            campInfo={{
              nombreCampo: campo.name,
              imagen: imageUrl,
              coordinates: [campo.coordinates.lon, campo.coordinates.lat],
              features: campoFeatures,
            }}
            cultivosSeleccionados={campoFeatures.map((f) => f.crop)}
            feats={campoFeatures.map((f) => f.polygon)}
            edit
          />
        </>
      )}
    </div>
  );
}
