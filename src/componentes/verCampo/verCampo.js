/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from '../conexionBack/conexionBack';
import { createHeatmap } from '../reusable/map/funcionesMapa';
import Loader from '../reusable/loader/loader';
import AgroMap from '../reusable/map/agroMap';
import { CROP_TYPES_TRANSLATIONS } from '../../constants/translations';
import './verCampo.scss';
import IndicatorContext from '../infoCampo/indicatorContext';

export default function VerCampo({ crop }) {
  const { field } = useParams();
  const { userID } = useParams();
  // const { crop } = useParams();
  const [campo, setCampo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [campoFeatures, setCampoFeatures] = useState(null);

  const getField = async () => {
    const accessToken = `Bearer ${userID}`;
    const response = await get(`field/${field}`, {
      headers: {
        Authorization: accessToken,
      },
    });
    setCampo(response);
  };
  const indicatorContextVariable = useContext(IndicatorContext);
  const selectedIndicator = indicatorContextVariable.indicator;
  const { selectedTimePeriod } = indicatorContextVariable;

  function findNearestDateIndex(dates) {
    let startDate;
    let endDate;

    const today = new Date();

    if (selectedTimePeriod === 'LastWeek') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
    } else if (selectedTimePeriod === 'LastMonth') {
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      endDate = today;
    } else if (selectedTimePeriod === 'LastYear') {
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      endDate = today;
    } else {
      startDate = new Date(Math.max(...dates));
      endDate = today;
    }

    const dateDifferences = dates.map((date) => Math.abs(date - startDate));

    // Find the index of the date with the smallest difference
    const nearestDateIndex = dateDifferences.indexOf(Math.min(...dateDifferences));

    return nearestDateIndex;
  }

  useEffect(() => {
    getField();
  }, [field]);

  useEffect(() => {
    // Update campo variable when userData changes
    setIsLoading(true);
    if (campo && selectedIndicator && selectedTimePeriod) {
      const index = findNearestDateIndex(campo.plots[0].history.map((hist) => new Date(hist.fecha)));
      setCampoFeatures(createHeatmap(campo, selectedIndicator, index));
    }
  }, [campo]);

  useEffect(() => {
    if (campo && campoFeatures && isLoading) {
      setIsLoading(false);
    }
  });

  const filterCrops = () => {
    if (crop) {
      if (crop === 'Todos') {
        return campoFeatures;
      }

      return campoFeatures.filter((feat) => crop === CROP_TYPES_TRANSLATIONS[feat.crop]);
    }
    return [];
  };

  return (
    <div className="campo-mapa-cultivo" id="mapa">
      {isLoading
        ? <Loader />
        : (
          <AgroMap
            coordinates={[campo.coordinates.lon, campo.coordinates.lat]}
            changeCoordinates={(cam) => {}}
            addFeatures={(cam) => { }}
            removeFeature={(cam, removedFeature) => { }}
            // eslint-disable-next-line max-len
            feats={filterCrops()}
            featErased={null}
            edit
            view
          />
        )}
    </div>
  );
}

// coordinates, changeCoordinates, addFeatures, removeFeature, feats, featErased,

VerCampo.propTypes = {
  crop: PropTypes.string.isRequired,
};
