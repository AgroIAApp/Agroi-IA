/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import excelent from '../../images/excelent.png';
import bluewater from '../../images/bluewater.png';
import dry from '../../images/dry.png';
import alerta from '../../images/alerta.png';
import congelado from '../../images/congelado.png';
import maleza from '../../images/maleza.png';
import nutrientes from '../../images/nutrientes.png';
import insecto from '../../images/insecto.png';

export default function Diagnostico({ problema }) {
  const diagnosticKeys = {
    EXCELENT: {
      name: 'EXCELENT',
      translate: 'Excelente',
      message: 'Felicidades! Tener un cultivo en excelentes condiciones implica cuidar cada aspecto del proceso agrícola. Los beneficios son notables: mayor rendimiento, resistencia a plagas y enfermedades, y una producción de alta calidad. ¡A seguir así!',
      image: excelent,
      className: 'cards-subtitle',
      classNameTitle: 'diagnostic-subtitle excellent-subtitle',
    },
    VERY_GOOD: {
      name: 'VERY_GOOD',
      translate: 'Muy bueno',
      message: '¡Excelente trabajo! Tu cultivo está en un estado muy bueno, demostrando un excelente manejo agrícola. Esto se refleja en un rendimiento destacado, alta resistencia a plagas y enfermedades, y una producción de calidad superior. Continúa con este esfuerzo para mantener y mejorar aún más los resultados.',
      image: excelent,
      className: 'diagnostic-class very-class',
      classNameTitle: 'diagnostic-subtitle excellent-subtitle',
    },
    GOOD: {
      name: 'GOOD',
      translate: 'Bueno',
      message: '¡Felicitaciones! Tener un cultivo en buen estado es el resultado de un buen manejo agrícola. Con un cuidado adecuado, tu cultivo se encuentra en un nivel satisfactorio, lo que se traduce en un rendimiento aceptable y resistencia a algunas plagas y enfermedades. Sigue así para obtener una producción de calidad.',
      image: excelent,
      className: 'diagnostic-class good-class',
      classNameTitle: 'diagnostic-subtitle excellent-subtitle',
    },
    FROSTING: {
      name: 'FROSTING',
      translate: 'Congelamiento',
      message: 'Atención! El campo congelado puede causar daños significativos a los cultivos, afectando su crecimiento y desarrollo. La congelación puede dañar las plantas y disminuir su producción. Toma medidas para proteger tus cultivos del frío extremo y asegúrate de que estén preparados para enfrentar las bajas temperaturas.',
      image: congelado,
      className: 'diagnostic-class frosting-class',
      classNameTitle: 'diagnostic-subtitle frosting-subtitle',
    },
    OVERHYDRATION: {
      name: 'OVERHYDRATION',
      translate: 'Sobrehidratación',
      message: '¡Cuidado con la sobrehidratación! Un exceso de agua en el cultivo puede reducir su rendimiento y calidad, además de propiciar el desarrollo de enfermedades y plagas. Mantén un equilibrio hídrico adecuado para un cultivo saludable y productivo.',
      image: bluewater,
      className: 'diagnostic-class overhydration-class',
      classNameTitle: 'diagnostic-subtitle overhydration-subtitle',
    },
    DEHYDRATION: {
      name: 'DEHYDRATION',
      translate: 'Deshidratación',
      message: '¡Atención! La falta de agua puede afectar negativamente el cultivo, provocando disminución del rendimiento y calidad. Asegúrate de proporcionar la cantidad de agua necesaria para un crecimiento óptimo.',
      image: dry,
      className: 'diagnostic-class dehydration-class',
      classNameTitle: 'diagnostic-subtitle dehydration-subtitle',
    },
        PROBLEMA: {
      name: 'PROBLEMA',
      translate: 'Problema',
      message: '¡Atención! Su campo presenta un problema que requiere de su atención. Por favor, acceda al apartado de comunidad para poder establecer el mismo con exactitud.',
      image: alerta,
      className: 'diagnostic-class dehydration-class',
      classNameTitle: 'diagnostic-subtitle problema-subtitle',
    }, NUTRIENTE: {
      name: 'FALTA DE NUTRIENTES',
      translate: 'Faltan de nutrientes',
      message: '¡Atención! La carencia de nutrientes puede impactar negativamente en el crecimiento de tus cultivos, resultando en una disminución en el rendimiento y la calidad. Asegúrate de proporcionar los nutrientes necesarios para un desarrollo óptimo.',
      image: nutrientes,
      className: 'diagnostic-class dehydration-class',
      classNameTitle: 'diagnostic-subtitle problema-subtitle',
    }, MALEZA: {
      name: 'MALEZA',
      translate: 'Maleza',
      message: '¡Atención! La proliferación de maleza puede perjudicar significativamente tus cultivos, reduciendo su productividad y calidad. Asegúrate de controlar la maleza de manera efectiva para un crecimiento óptimo de tus cultivos.',
      image: maleza,
      className: 'diagnostic-class dehydration-class',
      classNameTitle: 'diagnostic-subtitle problema-subtitle',
    }, INSECTOS: {
      name: 'INSECTOS',
      translate: 'Plaga de insectos',
      message: '¡Atención! Las plagas de insectos pueden causar daños graves a tus cultivos, disminuyendo su producción y calidad. Asegúrate de implementar medidas de control de plagas para un crecimiento óptimo de tus cultivos.',
      image: insecto,
      className: 'diagnostic-class dehydration-class',
      classNameTitle: 'diagnostic-subtitle problema-subtitle',
    },
  };
  const user = JSON.parse(localStorage.getItem('name')) || {};
  const [diagnostico, setdiagnostico] = useState('DEHYDRATION');

  useEffect(() => {
    if (problema === 'overhydration') {
      setdiagnostico('OVERHYDRATION');
    } else if (problema === 'frosting') {
      setdiagnostico('FROSTING');
    } else if (problema === 'dehydration') {
      setdiagnostico('DEHYDRATION');
    }else if (problema === 'good') {
      setdiagnostico('GOOD');
    }else if (problema === 'very_good') {
      setdiagnostico('VERY_GOOD');
    }else if (problema === 'excelent') {
      setdiagnostico('EXCELENT');
    }else if (problema === 'problem') {
      setdiagnostico('PROBLEMA');
    }else if (problema === 'fal_nut') {
      setdiagnostico('NUTRIENTE');
    }else if (problema === 'maleza') {
      setdiagnostico('MALEZA');
    }else if (problema === 'insectos') {
      setdiagnostico('INSECTOS');
    }
  }, [problema]);

  const {
    name, translate, message, image, className, classNameTitle,
  } = diagnosticKeys[diagnostico];

  return (
    <Card className="cards-wrapper-diagnostico">
      <img src={image} alt="Imagen 4" style={{ width: '7rem', marginRight: '-1rem', marginLeft: '1rem', marginTop: '1rem', marginBottom: '1rem' }} />
      <div className="diagnostico-wrapper">
        <div className={classNameTitle}>
          {translate}
        </div>
        <div className={className}>
          {message}
        </div>
      </div>
    </Card>
  );
}
