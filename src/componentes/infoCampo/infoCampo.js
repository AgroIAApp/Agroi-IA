/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-computed-key */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-useless-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/order */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './infoCampo.scss';
import '../verCultivos/verCultivos.scss';
import Papa from 'papaparse';
import Chart from 'react-google-charts';
import DownloadButton from './downloadButton';
import Diagnostico from './diagnostico';
import axios from 'axios';
import ProductCard from './meliCard';
import excelent from '../../images/excelent.png';
import upLine from '../../images/ascending.png';
import downLine from '../../images/descending.png';
// import Card from '../reusable/card/card';
import { Button, Card, Form } from 'react-bootstrap';
import { differenceInDays } from 'date-fns';
import { get, patch } from '../conexionBack/conexionBack';
import VerCampo from '../verCampo/verCampo';
import Header from '../reusable/header/header';
import Loader from '../reusable/loader/loader';
import vector1 from '../../images/vector1.jpg';
import { CROP_TYPES_KEYS } from '../../constants/plots';
import { CROP_TYPES_TRANSLATIONS } from '../../constants/translations';
import IndicatorContext from './indicatorContext';
import { COLOR_RANGES } from '../../constants/ndviColors';
import ToolTip from '../reusable/toolTip/toolTip';

export default function InfoCampo() {
  const [problema, setProblema] = useState('');
  const { userID } = useParams();
  const { field } = useParams();
  const user = JSON.parse(localStorage.getItem('name')) || {};
  const [crop, setCrop] = useState('Todos');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('LastWeek');
  const [lineData, setLineData] = useState([['', crop]]); // VER ESTO
  const [barData, setBarData] = useState([['', crop]]); // VER ESTO
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [erased, setNewErased] = useState([]);
  const [newFeatures, setNewFeatures] = useState([]);
  const [metrosCuadrados, setMetrosCuadrados] = useState([]);
  const [porcentajeSano, setporcentajeSano] = useState([]);
  const [ndvi, setNdvi] = useState([]);
  const [humedad, setHumedad] = useState([]);
  const [metrosCuadradosViejo, setMetrosCuadradosviejo] = useState([]);
  const [porcentajeSanoviejo, setporcentajeSanoviejo] = useState([]);
  const [ndviviejo, setNdviviejo] = useState([]);
  const [humedadviejo, setHumedadviejo] = useState([]);
  const [fieldRest, setField] = useState(field);
  const [actualizarGraf, setActualizarGraf] = useState(1);
  const [cropList, setCropList] = useState(['Todos']);
  const nav = useNavigate();
  const today = new Date();

  const SOLUTION_KEYS = {
    dehydration: 'ACONDICIONADOR DE SUELO',
    frosting: 'TELA ANTI HELADA',
    fal_nut: 'FERTILIZANTE',
    maleza: 'HERBICIDA',
    insectos: 'INSECTICIDA',
    very_good: 'iphone xr',
  };

  const traducciones = {
    Girasol: {
      cultivo: 'sunflower',
    },
    Soja: {
      cultivo: 'soy',
    },
    Trigo: {
      cultivo: 'wheat',
    },
    Maiz: {
      cultivo: 'corn',
    },
    Todos: {
      cultivo: 'todos',
    },
  };

  const [user2, setUser2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = `Bearer ${userID}`;
        const user22 = await get('user/fields/', {
          headers: {
            Authorization: accessToken,
          },
        });
        setUser2(user22);
        console.log('el usuario es: ', user22);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [userID]);

  const [indicator, setIndicator] = useState('ndvi');
  // const selectedIndicator = useContext();

  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    setIndicator(newValue);
  };

  const [campoInfo, setCampoInfo] = useState({
    nombreCampo: '',
    imagen: '',
    coordinates: [-58.702963, -34.671792],
    features: [],
  });

  const removeFeatureSt = (feats, removedFeature) => {
    setNewFeatures(feats);
    setNewErased(removedFeature[0]);
  };

  const [lineChartOptions, setlineChartOptions] = useState({
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Popularity',
    },
    colors: ['#2a7d2e'], // Uso Main green, pero no me deja poner la variable
    series: {
      0: { curveType: 'normal', pointShape: 'circle', pointSize: '7' },
    },
  });

  const [barChartOptions, setBarChartOptions] = useState({
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Popularity',
    },
    colors: ['#2a7d2e'], // Uso Main green, pero no me deja poner la variable
    series: {
      0: { curveType: 'normal', pointShape: 'circle', pointSize: '7' },
    },
  });

  const handleDataChange = (years, dataArray, xName, yName, magicNumber) => {
    user2.fields.forEach((fiel, index) => {
      if (fiel._id === fieldRest) {
        const campo = user2.fields[index].name;
        const newData = ([['', campo]]);
        if (magicNumber === 1) {
          setLineData([['', campo]]);
        } else {
          setBarData([['', campo]]);
        }
        for (let i = 0; i < dataArray.length; i += 1) {
          newData.push([years[i], dataArray[i]]);
        }
        if (magicNumber === 1) {
          setLineData(newData);
          setlineChartOptions((prevOptions) => ({
            ...prevOptions,
            hAxis: { ...prevOptions.hAxis, title: xName },
            vAxis: { ...prevOptions.vAxis, title: yName },
          }));
        } else {
          setBarData(newData);
          setBarChartOptions((prevOptions) => ({
            ...prevOptions,
            hAxis: { ...prevOptions.hAxis, title: xName },
            vAxis: { ...prevOptions.vAxis, title: yName },
          }));
        }
      }
    });
  };

  const handleDataChangeEmpty = (xName, yName, magicNumber) => {
    user2.fields.forEach((fiel, index) => {
      if (fiel._id === fieldRest) {
        const campo = user2.fields[index].name;
        const newData = ([['', campo]]);
        if (magicNumber === 1) {
          setLineData([['', campo]]);
        } else {
          setBarData([['', campo]]);
        }
        if (magicNumber === 1) {
          setLineData(newData);
          setlineChartOptions((prevOptions) => ({
            ...prevOptions,
            hAxis: { ...prevOptions.hAxis, title: xName },
            vAxis: { ...prevOptions.vAxis, title: yName },
          }));
        } else {
          setBarData(newData);
          setBarChartOptions((prevOptions) => ({
            ...prevOptions,
            hAxis: { ...prevOptions.hAxis, title: xName },
            vAxis: { ...prevOptions.vAxis, title: yName },
          }));
        }
      }
    });
  };

  const handleButtonClick = (buttonText) => {
    setSelectedTimePeriod(buttonText);
    if (selectedTimePeriod === 'LastWeek') {
      console.log('LastWeek');
    } else if (selectedTimePeriod === 'LastMonth') {
      console.log('LastMonth');
    } else if (selectedTimePeriod === 'LastYear') {
      console.log('LastYear');
    } else {
      console.log('FullHistory');
    }
  };

  const processData = (csvData) => {
    const labels = [];
    const valoresY = [];
    const valoresY2 = [];
    const dataMap = new Map();
    const dataMap2 = new Map();
    const [a, otherName, name] = csvData[0];
    for (let i = 1; i < csvData.length - 1; i += 1) {
      const [cropCSV, xValue, yValue, yValueBar] = csvData[i];

      if (!dataMap.has(xValue)) {
        dataMap.set(xValue, Number(yValue));
        dataMap2.set(xValue, Number(yValueBar));
      } else {
        dataMap.set(xValue, dataMap.get(xValue) + Number(yValue));
        dataMap2.set(xValue, dataMap2.get(xValue) + Number(yValueBar));
      }
      if (!labels.includes(xValue)) {
        labels.push(xValue);
      }
    }
    dataMap.forEach((value) => {
      valoresY.push(value);
    });
    dataMap2.forEach((value) => {
      valoresY2.push(value);
    });
    const years = labels;
    const data = valoresY;
    const data2 = valoresY2;
    return {
      years, data, data2, otherName, name,
    };
  };

  const actualizarHistBack = () => {
    const accessToken = `Bearer ${userID}`;
    user2.fields.forEach((fiel, index) => {
      if (fiel._id === fieldRest) {
        /* user2.fields[index].history.years = [];
        user2.fields[index].history.sown = [];
        user2.fields[index].history.harvested = []; */
        patch(`field/history/${fiel._id}`, user2.fields[index].history, {
          headers: {
            Authorization: accessToken,
          },
        });
      }
    });
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    Papa.parse(file, {
      complete: (result) => {
        const {
          years, data, data2, otherName, name,
        } = processData(result.data);
        user2.fields.forEach((fiel, index) => {
          if (fiel._id === fieldRest) {
            user2.fields[index].history.years.push(...years);
            user2.fields[index].history.sown.push(...data);
            user2.fields[index].history.harvested.push(...data2);
            const uniqueYears = [];
            const uniqueSown = [];
            const uniqueHarvested = [];

            for (let i = 0; i < user2.fields[index].history.years.length; i += 1) {
              const year = parseFloat(user2.fields[index].history.years[i]);
              const sownValue = parseFloat(user2.fields[index].history.sown[i]);
              const harvestedValue = parseFloat(user2.fields[index].history.harvested[i]);

              if (!uniqueYears.includes(year)) {
                uniqueYears.push(year);
                uniqueSown.push(sownValue);
                uniqueHarvested.push(harvestedValue);
              } else {
                const existingYearIndex = uniqueYears.indexOf(year);
                uniqueSown[existingYearIndex] += sownValue;
                uniqueHarvested[existingYearIndex] += harvestedValue;
              }
            }

            // Actualizar los arrays en el objeto user2
            user2.fields[index].history.years = uniqueYears;
            user2.fields[index].history.sown = uniqueSown;
            user2.fields[index].history.harvested = uniqueHarvested;
            setUser2(user2);
            setActualizarGraf(actualizarGraf + 1);
          }
        });
      },
    });
  };

  const handleSearch = async () => {
    console.log('voy a buscar: ', searchTerm);
    try {
      const response = await axios.get(
        `https://api.mercadolibre.com/sites/MLA/search?q=${searchTerm}`,
      );
      setProducts(response.data.results);
    } catch (error) {
      console.error('Error fetching data from MercadoLibre API:', error);
    }
  };

  const metricsForMenu = () => {
    console.log(user2);
    let metros = 0;
    let sano = 0;
    const cultivo = traducciones[crop].cultivo;
    let ndviTemp = 0;
    let humedadTemp = 0;
    let cuantosPlots = 0;
    let fullHistory = false;
    const fechaActual = new Date();
    const fechaAUsar = new Date(fechaActual);
    let diferenciaMenor = Number.MAX_VALUE;
    let huboAlguno = false;
    if (selectedTimePeriod === 'LastWeek') {
      const diasArestar = 7;
      fechaAUsar.setDate(fechaActual.getDate() - diasArestar);
    } else if (selectedTimePeriod === 'LastMonth') {
      const diasArestar = 30;
      fechaAUsar.setDate(fechaActual.getDate() - diasArestar);
    } else if (selectedTimePeriod === 'LastYear') {
      const diasArestar = 365;
      fechaAUsar.setDate(fechaActual.getDate() - diasArestar);
    } else if (selectedTimePeriod === 'FullHistory') {
      fechaAUsar.setDate(fechaActual.getDate());
      fullHistory = true;
    }
    if (user2 && user2.fields) {
      user2.fields.forEach((fiel, index) => {
        if (fiel._id === fieldRest) {
          user2.fields[index].plots.forEach((plot) => {
            if (plot.crop === cultivo || (crop === 'Todos' && plot.crop !== 'none')) {
              diferenciaMenor = Number.MAX_VALUE;
              huboAlguno = false;
              let indexAusar = 0;
              let histLen = plot.history.length;
              plot.history.forEach((instance, index2) => {
                if (index2 !== 0) {
                  const fechaInstancia = new Date(instance.createdAt);
                  const diferenciaNueva = differenceInDays(fechaActual, fechaInstancia);
                  if (diferenciaNueva <= diferenciaMenor && fechaInstancia <= fechaAUsar && histLen - 1 > index2) {
                    diferenciaMenor = diferenciaNueva;
                    indexAusar = index2;
                    huboAlguno = true;
                  }
                }
              });
              if ((plot.history[indexAusar].diagnostics === 'excelent' || plot.history[indexAusar].diagnostics === 'very_good' || plot.history[indexAusar].diagnostics === 'good' || plot.history[indexAusar].diagnostics === 'none') && huboAlguno) {
                sano += 121;
              } if (huboAlguno) {
                metros += 121;
                cuantosPlots += 1;
                ndviTemp += plot.history[indexAusar].ndvi;
                humedadTemp += plot.history[indexAusar].ndmi;
              }
            }
          });
          ndviTemp = (ndviTemp / cuantosPlots).toFixed(2);
          humedadTemp = (humedadTemp / cuantosPlots).toFixed(2);
          const porcentajeSanou = sano;
          const porcentajeSanoRedondeado = porcentajeSanou;
          setporcentajeSanoviejo(Math.round(((porcentajeSano - porcentajeSanoRedondeado) / Math.abs(porcentajeSanoRedondeado)) * 100));
          setNdviviejo(Math.round(((ndvi - ndviTemp) / Math.abs(ndviTemp)) * 100));
          setHumedadviejo(Math.round(((humedad - humedadTemp) / Math.abs(humedadTemp)) * 100));
          setMetrosCuadradosviejo(Math.round(((metrosCuadrados - metros) / Math.abs(metros)) * 100));
          return;
        }
      });
    }
  };

  const changeProblem = () => {
    if (problema !== 'very_good' && problema !== 'problem') {
      setSearchTerm(SOLUTION_KEYS[problema]);
    }
  };

  const metrics = () => {
    setporcentajeSano();
    let isProblema = 0;
    let metros = 0;
    let sano = 0;
    let problem = '';
    const cultivo = traducciones[crop].cultivo;
    let hayDatos = false;
    let ndviTemp = 0;
    let humedadTemp = 0;
    let cuantosPlots = 0;
    const fechaActual = new Date();
    let diferenciaMenor = Number.MAX_VALUE;
    if (user2 && user2.fields) {
      user2.fields.forEach((fiel, index) => {
        if (fiel._id === fieldRest) {
          user2.fields[index].plots.forEach((plot) => {
            if (plot.crop === cultivo || (crop === 'Todos' && plot.crop !== 'none')) {
              diferenciaMenor = Number.MAX_VALUE;
              metros += 121;
              let indexAusar = 0;
              plot.history.forEach((instance, index2) => {
                if (index2 !== 0) {
                  const fechaInstancia = new Date(instance.createdAt);
                  const diferenciaNueva = differenceInDays(fechaActual, fechaInstancia);
                  if (diferenciaNueva <= diferenciaMenor) {
                    diferenciaMenor = diferenciaNueva;
                    indexAusar = index2;
                  }
                }
              });
              if (plot.history[indexAusar].diagnostics === 'excelent' || plot.history[indexAusar].diagnostics === 'very_good' || plot.history[indexAusar].diagnostics === 'good' || plot.history[indexAusar].diagnostics === 'none') {
                sano += 121;
              } if (plot.history[indexAusar].diagnostics != null) {
                hayDatos = true;
              }
              cuantosPlots += 1;
              ndviTemp += plot.history[indexAusar].ndvi;
              humedadTemp += plot.history[indexAusar].ndmi;
              if ((plot.history[indexAusar].diagnostics === 'overhydration' || plot.history[indexAusar].diagnostics === 'problem' || plot.history[indexAusar].diagnostics === 'frosting' || plot.history[indexAusar].diagnostics === 'dehydration' || plot.history[indexAusar].diagnostics === 'fal_nut' || plot.history[indexAusar].diagnostics === 'maleza' || plot.history[indexAusar].diagnostics === 'insectos') && problem === '') {
                problem = plot.history[indexAusar].diagnostics;
                isProblema = 1;
              }
            }
          });
          if (problem === '' && isProblema === 0) {
            problem = 'very_good';
          }
          setProblema(problem);
          ndviTemp = (ndviTemp / cuantosPlots).toFixed(2);
          humedadTemp = (humedadTemp / cuantosPlots).toFixed(2);
          setNdvi(ndviTemp);
          setHumedad(humedadTemp);
          const porcentajeSanou = sano;
          const porcentajeSanoRedondeado = porcentajeSanou;
          if (hayDatos) { setporcentajeSano(porcentajeSanoRedondeado); }
          setMetrosCuadrados(metros);
          return;
        }
      });
    }
  };

  const getCrops = () => {
    const crops = ['Todos'];

    if (user2 && user2.fields) {
      const selectedField = user2.fields.find((aField) => aField._id === fieldRest);
      if (selectedField) {
        const fieldCrops = selectedField.plots.map((plot) => plot.crop);

        const distinctCrops = [...new Set(fieldCrops)];
        distinctCrops.forEach((cr) => {
          if (cr !== CROP_TYPES_KEYS.NONE) { crops.push(CROP_TYPES_TRANSLATIONS[cr] || cr); }
        });
      }
    }
    setCropList(crops);
  };

  const handleFieldChange = (event) => {
    setField(event.target.value);
    metrics();
    nav(`/${userID}/infoCampo/${event.target.value}`);
  };

  const handleCropChange = (event) => {
    setCrop(event.target.value);
  };

  useEffect(() => {
    changeProblem();
  }, [problema]);

  useEffect(() => {
    metrics();
  }, [crop]);

  useEffect(() => {
    metrics();
    getCrops();
    if (user2 && user2.fields) {
      user2.fields.forEach((fiel, index) => {
        if (fiel._id === fieldRest && user2.fields[index].history.years.length > 0) {
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.sown, 'Años', 'Superficie sembrada', 1);
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.harvested, 'Años', 'Superficie cosechada', 2);
        }
      });
    }
    console.log('el usuario es: ', user2);
  }, [user2]);

  useEffect(() => {
    if (user2 && user2.fields) {
      user2.fields.forEach((fiel, index) => {
        if (fiel._id === fieldRest && user2.fields[index].history.years.length > 0) {
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.sown, 'Superficie sembrada', 'Años', 1);
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.harvested, 'Superficie cosechada', 'Años', 2);
          actualizarHistBack();
        }
      });
    }
  }, [actualizarGraf]);

  useEffect(() => {
    metricsForMenu();
    console.log('el usuario es: ', user2);
  }, [selectedTimePeriod]);

  useEffect(() => {
    metrics();
    getCrops();
    let dataProcessed = false;
    if (user2 && user2.fields) {
      user2.fields.forEach((fiel, index) => {
        if (fiel._id === fieldRest && user2.fields[index].history.years.length > 0) {
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.sown, 'Superficie sembrada', 'Años', 1);
          handleDataChange(user2.fields[index].history.years, user2.fields[index].history.harvested, 'Superficie cosechada', 'Años', 2);
          dataProcessed = true;
        } else if (!dataProcessed) {
          handleDataChangeEmpty('Superficie sembrada', 'Años', 1);
          handleDataChangeEmpty('Superficie sembrada', 'Años', 2);
        }
      });
    }
  }, [fieldRest]);

  useEffect(() => {
    metrics();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    metricsForMenu();
  }, [metrosCuadrados, porcentajeSano, humedad, ndvi]);

  return (
    <div>
      <Header />
      {user2
        ? (
          <div className="gray-space">
            <Form.Select
              aria-label="Default select example"
              className="titulo-fachero-facherito"
              value={fieldRest} // Aquí establecemos el valor seleccionado
              onChange={handleFieldChange}
            >
              {user2.fields.map((fiel, index) => (
                <option key={index} value={fiel._id} className="option-select">
                  {fiel.name}
                </option>
              ))}
            </Form.Select>
            <div className="drop-but-container">
              {/* <div className="full-width" /> */}
              <div className="buttons-container">
                <button
                  className={selectedTimePeriod === 'LastWeek' ? 'button-dashboard selected' : 'button-dashboard'}
                  onClick={() => handleButtonClick('LastWeek')}
                >
                  Última semana
                  <div className={selectedTimePeriod === 'LastWeek' ? 'selected-line' : ''} />
                </button>
                <button
                  className={selectedTimePeriod === 'LastMonth' ? 'button-dashboard selected' : 'button-dashboard'}
                  onClick={() => handleButtonClick('LastMonth')}
                >
                  Último mes
                  <div className={selectedTimePeriod === 'LastMonth' ? 'selected-line' : ''} />
                </button>
                <button
                  className={selectedTimePeriod === 'LastYear' ? 'button-dashboard selected' : 'button-dashboard'}
                  onClick={() => handleButtonClick('LastYear')}
                >
                  Último año
                  <div className={selectedTimePeriod === 'LastYear' ? 'selected-line' : ''} />
                </button>
                <button
                  className={selectedTimePeriod === 'FullHistory' ? 'button-dashboard selected' : 'button-dashboard'}
                  onClick={() => handleButtonClick('FullHistory')}
                >
                  Historial completo
                  <div className={selectedTimePeriod === 'FullHistory' ? 'selected-line' : ''} />
                </button>
              </div>
              <div className="dropdown-container">
                <h6>Cultivos:</h6>
                <Form.Select
                  className="rounded-dropdown rounded-dropdown-cultivos"
                  value={crop} // Aquí establecemos el valor seleccionado
                  onChange={handleCropChange}
                >
                  {cropList.map((aCrop) => <option value={aCrop}>{aCrop}</option>)}
                </Form.Select>
              </div>
            </div>
            <div className="cards-container">
              <Card className="cards-wrapper">
                <div className="circle-card first" />
                <div className="cards-titles">
                  Total sembrado
                </div>
                {(metrosCuadrados < 0 || metrosCuadrados >= 0) && metrosCuadrados !== Infinity ? (
                  <div className="cards-Subtitle">
                    {Number(metrosCuadrados).toLocaleString()}
                    <span>m2</span>
                  </div>
                ) : (
                  <div className="cards-Subtitle-no-data">
                    No hay datos
                  </div>
                )}
                {(metrosCuadradosViejo < 0 || metrosCuadradosViejo >= 0) && metrosCuadradosViejo !== Infinity ? (
                  <div className={metrosCuadradosViejo < 0 ? 'cards-Subtitle-old-origin red' : 'cards-Subtitle-old-origin green'}>
                    {metrosCuadradosViejo}
                    %
                  </div>
                ) : null}

                {(metrosCuadradosViejo < 0 || metrosCuadradosViejo >= 0) && metrosCuadradosViejo !== Infinity ? (
                  <img src={metrosCuadradosViejo < 0 ? downLine : upLine} alt="Line Image" className="upLineImage upLineImageMetros" />
                ) : null}
              </Card>
              <Card className="cards-wrapper">
                <div className="circle-card second" />
                <div className="cards-titles">
                  Cultivo Sano
                </div>
                {(porcentajeSano < 0 || porcentajeSano >= 0) && porcentajeSano !== Infinity ? (
                  <div className="cards-Subtitle cards-Subtitle2">
                    {porcentajeSano.toLocaleString()}
                    <span>m2</span>
                  </div>
                ) : (
                  <div className="cards-Subtitle-no-data cards-Subtitle2">
                    No hay datos
                  </div>
                )}
                {(porcentajeSanoviejo < 0 || porcentajeSanoviejo >= 0) && porcentajeSanoviejo !== Infinity ? (
                  <div className={porcentajeSanoviejo < 0 ? 'cards-Subtitle-old-origin red' : 'cards-Subtitle-old-origin green'}>
                    {porcentajeSanoviejo}
                    %
                  </div>
                ) : null}
                {(porcentajeSanoviejo < 0 || porcentajeSanoviejo >= 0) && porcentajeSanoviejo !== Infinity ? (
                  <img src={porcentajeSanoviejo < 0 ? downLine : upLine} alt="Line Image" className="upLineImage upLineImageSano" />
                ) : null}
              </Card>
              <Card className="cards-wrapper">
                <div className="circle-card third" />
                <div className="cards-titles">
                  NDVI
                </div>
                {(ndvi < 0 || ndvi >= 0) && ndvi !== Infinity ? (
                  <div className="cards-Subtitle cards-Subtitle3">
                    {ndvi}
                  </div>
                ) : (
                  <div className="cards-Subtitle-no-data cards-Subtitle3">
                    No hay datos
                  </div>
                )}
                {(ndviviejo < 0 || ndviviejo >= 0) && ndviviejo !== Infinity ? (
                  <div className={ndviviejo < 0 ? 'cards-Subtitle-old-origin red' : 'cards-Subtitle-old-origin green'}>
                    {ndviviejo}
                    %
                  </div>
                ) : null}
                {(ndviviejo < 0 || ndviviejo >= 0) && ndviviejo !== Infinity ? (
                  <img src={ndviviejo < 0 ? downLine : upLine} alt="Line Image" className="upLineImage upLineImagendvi" />
                ) : null}
              </Card>
              <Card className="cards-wrapper">
                <div className="circle-card fourth" />
                <div className="cards-titles">
                  Humedad
                </div>
                {(humedad < 0 || humedad >= 0) && humedad !== Infinity ? (
                  <div className="cards-Subtitle cards-Subtitle4">
                    {humedad}
                  </div>
                ) : (
                  <div className="cards-Subtitle-no-data cards-Subtitle4">
                    No hay datos
                  </div>
                )}
                {(humedadviejo < 0 || humedadviejo >= 0) && humedadviejo !== Infinity ? (
                  <div className={humedadviejo < 0 ? 'cards-Subtitle-old-origin red' : 'cards-Subtitle-old-origin green'}>
                    {humedadviejo}
                    %
                  </div>
                ) : null}
                {(humedadviejo < 0 || humedadviejo >= 0) && humedadviejo !== Infinity ? (
                  <img src={humedadviejo < 0 ? downLine : upLine} alt="Line Image" className="upLineImage" />
                ) : null}
              </Card>
            </div>
            <div className="cards-container2">
              <Card className="mapa-card max-content">
                <IndicatorContext.Provider value={{ indicator }}>
                  <VerCampo campoInfo={campoInfo} crop={crop} />
                </IndicatorContext.Provider>
              </Card>
              <Card className="info-mapa derecha min-content">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title className="card-title-no-campo">ÍNDICES</Card.Title>
                  <Form>
                    <div key="inline-radio" className="mb-1 d-flex indices">
                      <div>
                        <Form.Check
                          inline
                          label="NDVI"
                          name="group1"
                          type="radio"
                          id="inline-radio-1"
                          value="ndvi"
                          onChange={handleRadioChange}
                          checked={indicator === 'ndvi'}
                        />
                        <ToolTip toolText="Hola como estas?" />
                      </div>
                      <div>
                        <Form.Check
                          inline
                          label="NDSI"
                          name="group1"
                          type="radio"
                          id="inline-radio-2"
                          value="ndsi"
                          onChange={handleRadioChange}
                          checked={indicator === 'ndsi'}
                        />
                        <ToolTip toolText="Hola como estas?" />
                      </div>
                      <div>
                        <Form.Check
                          inline
                          label="NDMI"
                          name="group1"
                          type="radio"
                          id="inline-radio-3"
                          value="ndmi"
                          onChange={handleRadioChange}
                          checked={indicator === 'ndmi'}
                        />
                        <ToolTip toolText="Mal" />
                      </div>
                    </div>
                  </Form>
                  <div className="mb-1 indicator-ranges">
                    {COLOR_RANGES[indicator].map(({ interval, color }) => (
                      <div className="range-container">
                        <div className="rango-color" style={{ backgroundColor: color }} />
                        <p className="rango-interval">
                          {interval}
                          {' '}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="primary" onClick={() => nav(`/campo/${userID}/${field}`)}>Mas Info</Button>
                </Card.Body>
              </Card>
            </div>
            <div className=" cards-container file-upload-container">
              <DownloadButton />
              {/* <input className="button-dashboard selected" type="file" id="csvInput" accept=".csv" onChange={(e) => handleFileUpload(e)} /> */}
              <Form.Group controlId="formFile">
                <Form.Control type="file" className="agro-uploader" accept=".csv" onChange={(e) => handleFileUpload(e)} />
              </Form.Group>
            </div>
            {lineData.length > 1 ? (
              <div className="dashboards-container" style={{ marginTop: '1.5rem' }}>
                <Card className="dashboard">
                  <Chart
                    width="40rem"
                    height="25rem"
                    chartType="ColumnChart"
                    loader={<div>Loading Chart</div>}
                    data={lineData}
                    options={lineChartOptions}
                    rootProps={{ 'data-testid': '2' }}
                  />
                </Card>
                <div style={{ marginRight: '1.5rem' }} />
                <Card className="dashboard">
                  <Chart
                    width="40rem"
                    height="25rem"
                    chartType="ColumnChart"
                    loader={<div>Loading Chart</div>}
                    data={barData}
                    options={barChartOptions}
                    rootProps={{ 'data-testid': '2' }}
                  />
                </Card>
              </div>
            )
              : (
                <div className="cards-container">
                  <Card className="info-card  text-center card-no-campo">
                    <Card.Header className="campo-info-card-header">
                      <Card.Img variant="left" src={vector1} className="vector" />
                    </Card.Header>
                    <Card.Body>
                      <Card.Title className="card-title-no-campo">TODAVÍA NO TIENES INFORMACIÓN HISTÓRICA DE TU CAMPO</Card.Title>
                      <Card.Text className="card-text-no-campo">
                        ¡Usa nuestro template y subí los datos de tu campo!
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              )}
            <div className="cards-container">
              <Diagnostico problema={problema} />
              {/* <Card className="cards-wrapper-diagnostico">
                <img src={excelent} alt="Imagen 4" style={{ width: '7rem', marginRight: '-1rem', marginLeft: '1rem' }} />
              </Card> */}
            </div>
            {problema === 'very_good' || problema === 'problem' || problema === ''
              ? <div /> : (
                <div className="cards-container">
                  {products.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) }
          </div>
        )
        : (
          <div className="loader-container">
            <Loader />
          </div>
        )}
    </div>
  );
}
