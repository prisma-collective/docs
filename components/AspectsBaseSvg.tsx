"use client";

import React, { useEffect, useRef } from 'react';
import InterAspectLights from './InterAspectLights';

interface AspectsAnimationProps {
  levels?: number;
  segmentsPerLevel?: number[];
  radii?: number[];
  colorList?: string[];
  randomOffsetQuotients?: number[];
  endAngleQuotients?: number[];
  minDuration?: number;
  maxDuration?: number;
  defaultInterAspectsHighlight?: boolean;
  setColourAspectHighlighted?: (value: boolean) => void; // Accept state-tracking functions from parent page (optional)
  setPlainAspectHighlighted?: (value: boolean) => void;
  setPracticeText?: (value: string) => void;
  setApplicationText?: (value: string) => void;
  textsPractice?: string[];
  textsApplication?: string[];
}

export const getRandomText = (texts: string[]): string => {
    const randomIndex = Math.floor(Math.random() * texts.length); // Generate a random index
    return texts[randomIndex]; // Return the randomly selected string
};

const currentHighlightedElements: Set<HTMLElement> = new Set();

const clearCurrentEmphasisedElements = () => {
  // Remove highlight from all currently highlighted elements
  currentHighlightedElements.forEach((element) => {
    if (element.classList.contains('spectrum')) {
      element.classList.remove('unhighlighted');
      element.classList.add('highlighted');
    };

    const interAspectLights = document.getElementById('inter_aspect_lights')
    interAspectLights?.classList.remove('highlighted')
    interAspectLights?.classList.add('unhighlighted')
  });

  currentHighlightedElements.clear(); // Clear the Set
};

const handleHighlight = (spectrumId: string) => {
  // Set opacity of all other spectrum colours to unhighlighted except the one in question
  const allSpectrums = document.querySelectorAll('.spectrum');
  allSpectrums.forEach(spectrum => {
      // Apply unhighlight to all other spectrum colours
      if (spectrum.id != spectrumId) {
        spectrum.classList.add('unhighlighted')

        // Add spectrum colour to list of emphasised/ interacted-with elements 
        const element = document.getElementById(spectrum.id);
        if (element) {
          currentHighlightedElements.add(element)
        }
      }
  });

  const interAspectLights = document.getElementById('inter_aspect_lights')
  interAspectLights?.classList.add('highlighted')
  interAspectLights?.classList.remove('unhighlighted')
};

const handleMouseEnter = (
  aspectId: string, 
  spectrumId: string, 
  setColourAspectHighlighted?: (value: boolean) => void,
  setPlainAspectHighlighted?: (value: boolean) => void,
  setPracticeText?: (value: string) => void,
  setApplicationText?: (value: string) => void,
  textsPractice?: string[],
  textsApplication?: string[],
) => {
    // Clear already highlighted elements
    handleMouseLeave();

    // Generate the ID for the repeat element
    const repeatId = `${spectrumId}-repeat`;

    // Check if the repeat element exists
    const hasRepeat = document.getElementById(repeatId) !== null;

    // Determine which ID to use: original or repeat
    const selectedId = hasRepeat && Math.random() < 0.5 ? repeatId : spectrumId;

    console.log("highlighting (selectedId): ", selectedId)
    handleHighlight(selectedId);
    
    // Only if coloured aspect is being selected...
    if (document.getElementById(aspectId)?.classList.contains('colour')) {
      const activeAspect = document.getElementById(aspectId)
      if (activeAspect) {
       activeAspect.classList.add('activeAspect')
      }
      setColourAspectHighlighted?.(true);

      // Set text for aspect display
      if (textsApplication) { 
        setApplicationText?.(getRandomText(textsApplication));
       }
    } else {
      setPlainAspectHighlighted?.(true);
    };

    // Set opacity of all aspects to 0.4 except the one being hovered
    const allAspects = document.querySelectorAll('.aspect, .aspectAnti');
    allAspects.forEach(aspect => {
        if (aspect.id !== aspectId) {
          (aspect as HTMLElement).style.opacity = '0.4'; // Cast to HTMLElement
        }
    });

    // Set text for aspect display
    if (textsPractice) { 
      setPracticeText?.(getRandomText(textsPractice));
     }
};

const handleMouseLeave = (
  setColourAspectHighlighted?: (value: boolean) => void, 
  setPlainAspectHighlighted?: (value: boolean) => void,
) => {

    clearCurrentEmphasisedElements();
    setColourAspectHighlighted?.(false);
    setPlainAspectHighlighted?.(false);

    // Reset opacity of all aspects back to 1
    const allAspects = document.querySelectorAll('.aspect, .aspectAnti');
    allAspects.forEach(aspect => {
      (aspect as HTMLElement).style.opacity = '1'; // Cast to HTMLElement
    });

    const activeElement = document.querySelector('.activeAspect');
    if (activeElement) {
      activeElement.classList.remove('activeAspect');
    }
};

const AspectsAnimation: React.FC<AspectsAnimationProps> = ({
  segmentsPerLevel = [4, 6, 5],
  radii = [150, 180, 202],
  colorList = ["#cd5aff", "#8067ff", "#ef64ff", "#ff4b85"],
  randomOffsetQuotients = [2, 2, 1.5],
  endAngleQuotients = [1.5, 1.5, 2],
  minDuration = 25,
  maxDuration = 120,
  defaultInterAspectsHighlight = false,
  setColourAspectHighlighted = () => {},
  setPlainAspectHighlighted = () => {},
  setPracticeText = () => {},
  setApplicationText = () => {},
  textsPractice = [],
  textsApplication = [],
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Listen for taps outside the currently highlighted elements
    document.addEventListener('touchstart', () => {
      handleMouseLeave(
        setColourAspectHighlighted, 
        setPlainAspectHighlighted
      );
    });

    const container = svgRef.current;

    if (!container) {
        console.error('SVG container not found.');
        return;
    }

    container.innerHTML = ''; // Clear the container

    let anti = false;
    let aspectWidthOffset = 15;

    const createCircle = (cx: number, cy: number, r: number) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toString());
      circle.setAttribute('cy', cy.toString());
      circle.setAttribute('r', r.toString());
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', 'none');
      return circle;
    };

    const createAspect = (
        cx: number, 
        cy: number, 
        outerR: number, 
        innerR: number, 
        startAngle: number, 
        endAngle: number, 
        id: string, 
        anti: boolean,
        fill: string
    ) => {
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const outerStartX = cx + outerR * Math.cos(startRad);
      const outerStartY = cy + outerR * Math.sin(startRad);
      const outerEndX = cx + outerR * Math.cos(endRad);
      const outerEndY = cy + outerR * Math.sin(endRad);

      const innerStartX = cx + innerR * Math.cos(endRad);
      const innerStartY = cy + innerR * Math.sin(endRad);
      const innerEndX = cx + innerR * Math.cos(startRad);
      const innerEndY = cy + innerR * Math.sin(startRad);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const d = `
        M ${outerStartX} ${outerStartY} 
        A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
        L ${innerStartX} ${innerStartY} 
        A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}
        Z
      `;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d.trim());
      path.classList.add(anti ? 'aspect' : 'aspectAnti');
      path.setAttribute('id', id);
      path.style.fill = fill;
      if (fill === 'white') {
        path.classList.add('plain')
      } else {
        path.classList.add('colour')
      };

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (isTouchDevice) {
        path.addEventListener('touchstart', (event) => {
          event.stopPropagation(); // Prevent this event from bubbling to the document listener
          handleMouseEnter(
            id, 
            `application-lights-spectrum-${fill.slice(1)}`,
            setColourAspectHighlighted,
            setPlainAspectHighlighted,
            setPracticeText,
            setApplicationText,
            textsPractice,
            textsApplication
          );
        });
      } else {
        path.addEventListener('mouseenter', () => handleMouseEnter(
          id, 
          `application-lights-spectrum-${fill.slice(1)}`,
          setColourAspectHighlighted,
          setPlainAspectHighlighted,
          setPracticeText,
          setApplicationText,
          textsPractice,
          textsApplication
        ));
        path.addEventListener('mouseleave', () => handleMouseLeave(
          setColourAspectHighlighted, 
          setPlainAspectHighlighted
        ));
      }
      
      return path;
    };

    const createRandomAngleRange = (angleStep: number, usedAngles: number, randomOffsetQuotient: number, endAngleQuotient: number) => {
      const randomOffset = Math.floor(Math.random() * angleStep) / randomOffsetQuotient;
      const startAngle = usedAngles + randomOffset;
      let endAngle = startAngle + angleStep / endAngleQuotient;

      if (endAngle > 360) {
        endAngle -= 360;
      }

      return { startAngle, endAngle, usedAngles: endAngle };
    };

    radii.forEach((radius, levelIndex) => {
        container.appendChild(createCircle(250, 250, radius));

        anti = !anti;
        aspectWidthOffset -= 3;

        const numSegments = segmentsPerLevel[levelIndex];
        const angleStep = 360 / numSegments;
        const randomOffsetQuotient = randomOffsetQuotients[levelIndex];
        const endAngleQuotient = endAngleQuotients[levelIndex];
        let usedAngles = 0;

        const numColoredSegments = Math.floor(Math.random() * (numSegments / 2 - 1)) + 1;
        const allIndices = Array.from({ length: numSegments }, (_, index) => index);
        const shuffledIndices = allIndices.sort(() => Math.random() - 0.5);
        const coloredIndices = new Set(shuffledIndices.slice(0, numColoredSegments));
        const levelClass = `level-${levelIndex}`; // Unique class for each level

        const randomDuration = Math.random() * (maxDuration - minDuration) + minDuration;

        const levelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        levelGroup.setAttribute('class', `level-${levelIndex}`); // Apply a unique class for each level group
        levelGroup.setAttribute('class', `level`); // Apply a level class for each level group

        for (let i = 0; i < numSegments; i++) {
            const { startAngle, endAngle, usedAngles: updatedUsedAngles } = createRandomAngleRange(
            angleStep,
            usedAngles,
            randomOffsetQuotient,
            endAngleQuotient
            );
            usedAngles = updatedUsedAngles;

            const aspectId = `aspect-${levelIndex}-${i}`;
            const aspectFill = coloredIndices.has(i) ? colorList[Math.floor(Math.random() * colorList.length)] : 'white';

            const aspect = createAspect(
            250,
            250,
            radius - aspectWidthOffset,
            radius + aspectWidthOffset,
            startAngle,
            endAngle,
            aspectId,
            anti,
            aspectFill,
            );

            aspect.style.animationDuration = `${randomDuration}s`;
            // Add the level class
            aspect.classList.add(levelClass);

            levelGroup.appendChild(aspect);
        }

        container.appendChild(levelGroup);
    });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        style={{ position: 'relative', zIndex: 1 }}
      />
      <InterAspectLights highlighted={defaultInterAspectsHighlight}/>
    </div>
  );
};

export default AspectsAnimation;
