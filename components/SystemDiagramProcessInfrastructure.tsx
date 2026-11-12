"use client"

import React from 'react';
import Link from 'next/link';

const SystemDiagramPI: React.FC = () => {
  return (
    <>
      <svg
        width="100%"
        height="Auto"
        viewBox="0 0 300 300"
        version="1.1"
        id="svg1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="overflow-visible"
      >
        <defs id="defs1">
          <marker
            style={{ overflow: 'visible' }}
            id="ArrowWideHeavy"
            refX="0"
            refY="0"
            orient="auto-start-reverse"
            markerWidth="0.65"
            markerHeight="0.65"
            viewBox="0 0 1 1"
            preserveAspectRatio="xMidYMid"
          >
            <path
              style={{ fill: 'context-stroke', fillRule: 'evenodd', stroke: 'none' }}
              d="m 1,0 -3,3 h -2 l 3,-3 -3,-3 h 2 z"
              id="path3"
            />
          </marker>
        </defs>
        
        <image
            href="/name-text-meeting-cards.png"
            width={66.04}
            height={14.901333}
            preserveAspectRatio="none"
            x={10}
            y={10}
            id="image1"
        />
        
        {/* Add clip paths */}
        <defs>
            <clipPath id="clipPathOrganising">
                <rect
                    id="rect14Clip"
                    width="28.679262"
                    height="36.130882"
                    x="132.59505"
                    y="158.1261"
                    ry="5.1096773"
                />
            </clipPath>
            <clipPath id="clipPathPublishing">
                <rect
                    id="rect15Clip"
                    width="28.679262"
                    height="36.130882"
                    x="185.82086"
                    y="158.1261"
                    ry="5.1096773"
                />
            </clipPath>
            <clipPath id="clipPathRegistering">
                <rect
                    id="rect13Clip"
                    width="28.679262"
                    height="36.130882"
                    x="79.369247"
                    y="100.90225"
                    ry="5.1096773"
                />
            </clipPath>
            <clipPath id="clipPathSubscribing">
                <rect
                    id="rect16Clip"
                    width="28.679262"
                    height="36.130882"
                    x="239.04666"
                    y="100.90225"
                    ry="5.1096773"
                />
            </clipPath>
            <linearGradient 
                id="gradientPath69"
                x1="253.12172"
                y1="77.16254"
                x2="253.12172"
                y2="93.82141"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0%" stopColor="#7faec2" />
                <stop offset="50%" stopColor="#02b4ff" />
                <stop offset="100%" stopColor="#7faec2" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="0,-10"
                    to="0,25"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath70"
                x1="105"
                y1="117"
                x2="130"
                y2="175"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#7faec2" />
                <stop offset="48%" stopColor="#02b4ff" />
                <stop offset="52%" stopColor="#02b4ff" />
                <stop offset="80%" stopColor="#7faec2" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-50,-30"
                    to="30,30"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath72"
                x1="210"
                y1="170"
                x2="240"
                y2="120"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#7faec2" />
                <stop offset="48%" stopColor="#02b4ff" />
                <stop offset="52%" stopColor="#02b4ff" />
                <stop offset="80%" stopColor="#7faec2" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-30,30"
                    to="30,-30"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath82"
                x1="220"
                y1="118"
                x2="146"
                y2="155"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#8067ff" />
                <stop offset="48%" stopColor="#2a00ff" />
                <stop offset="52%" stopColor="#2a00ff" />
                <stop offset="80%" stopColor="#8067ff" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="70,-10"
                    to="-10,120"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath83"
                x1="253"
                y1="136"
                x2="228"
                y2="176"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#8067ff" />
                <stop offset="48%" stopColor="#2a00ff" />
                <stop offset="52%" stopColor="#2a00ff" />
                <stop offset="80%" stopColor="#8067ff" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="70,-10"
                    to="-20,80"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath73"
                x1="145"
                y1="190"
                x2="145"
                y2="230"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#7faec2" />
                <stop offset="48%" stopColor="#02b4ff" />
                <stop offset="52%" stopColor="#02b4ff" />
                <stop offset="80%" stopColor="#7faec2" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="0,-30"
                    to="0,30"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
            <linearGradient 
                id="gradientPath74"
                x1="200"
                y1="232"
                x2="200"
                y2="198"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="20%" stopColor="#7faec2" />
                <stop offset="48%" stopColor="#02b4ff" />
                <stop offset="52%" stopColor="#02b4ff" />
                <stop offset="80%" stopColor="#7faec2" />
                <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="0,30"
                    to="0,-30"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </linearGradient>
        </defs>

        {/* Other paths and text elements remain unchanged */}

        <path
            className='stroke-[0.75px] stroke-white'
            markerEnd='url(#ArrowWideHeavy)'
            d="M 93.708879,67.227056 V 93.82141"
            id="path68"
        />

        <path
            className='stroke-[0.75px] stroke-white'
            markerEnd='url(#ArrowWideHeavy)'
            d="M 147,67.227056 V 93.82141"
            id="path68B"
        />

        <path
            className='stroke-[0.75px] stroke-white'
            markerEnd='url(#ArrowWideHeavy)'
            d="M 201,67.227056 V 93.82141"
            id="path68C"
        />

        <path
            className='stroke-[0.75px] stroke-white'
            markerEnd='url(#ArrowWideHeavy)'
            d="M 253,67.227056 V 93.82141"
            id="path68D"
        />

        <path
            className='stroke-gray-600 stroke-3'
            markerEnd='url(#ArrowWideHeavy)'
            d="m 172,176.19154 H 172.1"
            id="path71"
        />

        <path
            className='stroke-gray-600 stroke-3'
            markerEnd='url(#ArrowWideHeavy)'
            d="m 180,176.19154 H 181"
            id="path71B"
        />

        <Link href="/processes/process-infrastructuring/protocols/registering-organising" className="hover-area-link">
            <path
                className="hover-path"
                d="m 108.04851,118.9677 c 2.18813,0 4.37626,0 6.20959,0 1.83333,0 3.31179,0 4.05104,0.87099 0.73925,0.87099 0.73925,2.61291 0.73925,10.99478 0,8.38188 0,23.40281 0,32.0693 0,8.6665 0,10.85593 1.08943,12.07235 1.08944,1.21642 3.0503,1.21642 4.80543,1.21642 1.75513,0 3.19538,0 4.63566,0"
                stroke="transparent"
                strokeWidth="8"  /* Larger stroke width to make the hover area larger */
                fill="transparent"
                pointerEvents="auto"  /* Ensure this path triggers the hover */
            />
            <path
                stroke='url(#gradientPath70)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 108.04851,118.9677 c 2.18813,0 4.37626,0 6.20959,0 1.83333,0 3.31179,0 4.05104,0.87099 0.73925,0.87099 0.73925,2.61291 0.73925,10.99478 0,8.38188 0,23.40281 0,32.0693 0,8.6665 0,10.85593 1.08943,12.07235 1.08944,1.21642 3.0503,1.21642 4.80543,1.21642 1.75513,0 3.19538,0 4.63566,0"
                id="path70"
            />
        </Link>

        <Link href="/processes/process-infrastructuring/protocols/case-subscribing" className="hover-area-link">
            <path
                className="hover-path"
                d="m 214.50012,176.19154 c 2.36555,0 4.7311,0 6.65314,0 1.92204,0 3.40048,0 4.13974,-1.1556 0.73926,-1.1556 0.73926,-3.46672 0.73926,-11.51222 0,-8.0455 0,-21.82479 0.0296,-30.20655 0.0296,-8.38176 0.0887,-11.36554 0.97582,-12.85751 0.88711,-1.49196 2.60215,-1.49196 4.198,-1.49196 1.59585,0 3.00221,0 4.5492,0"
                stroke="transparent"
                strokeWidth="8" 
                fill="transparent"
                pointerEvents="auto"  
            />
            <path
                stroke='url(#gradientPath72)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 214.50012,176.19154 c 2.36555,0 4.7311,0 6.65314,0 1.92204,0 3.40048,0 4.13974,-1.1556 0.73926,-1.1556 0.73926,-3.46672 0.73926,-11.51222 0,-8.0455 0,-21.82479 0.0296,-30.20655 0.0296,-8.38176 0.0887,-11.36554 0.97582,-12.85751 0.88711,-1.49196 2.60215,-1.49196 4.198,-1.49196 1.59585,0 3.00221,0 4.5492,0"
                id="path72"
            />
        </Link>

        <Link href="/processes/process-infrastructuring/protocols/organising-aspect" className="hover-area-link">
            <path
                className="hover-path"
                d="m 146.93467,194.25699 c 0,11.89283 0,23.78566 0,35.67849"
                stroke="transparent"
                strokeWidth="8"  
                fill="transparent"
                pointerEvents="auto"
            />
            <path
                stroke='url(#gradientPath73)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 146.93467,194.25699 c 0,11.89283 0,23.78566 0,35.67849"
                id="path73"
            />
        </Link>

        <Link href="/processes/process-infrastructuring/protocols/aspect-case" className="hover-area-link">
            <path
                className="hover-path"
                d="m 200.66129,232.24194 c 0,-11.05914 0,-22.11828 0,-33.17742"
                stroke="transparent"
                strokeWidth="8"  
                fill="transparent"
                pointerEvents="auto"
            />
            <path
                stroke='url(#gradientPath74)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 200.66129,232.24194 c 0,-11.05914 0,-22.11828 0,-33.17742"
                id="path74"
            />
        </Link>

        <Link href="/processes/process-infrastructuring/protocols/resourcing-organising" className="hover-area-link">
            <path
                className="hover-path"
                d="m 222.2843,118.9677 c -22.90982,0 -45.81895,0 -58.31896,0 -12.50001,0 -14.49137,0 -15.58661,1.16798 -1.09524,1.16799 -1.09524,3.29156 -1.09524,9.1908 0,5.89924 0,15.46751 0,25.03599"
                stroke="transparent"
                strokeWidth="8"  
                fill="transparent"
                pointerEvents="auto"
            />
            <path
                stroke='url(#gradientPath82)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 222.2843,118.9677 c -22.90982,0 -45.81895,0 -58.31896,0 -12.50001,0 -14.49137,0 -15.58661,1.16798 -1.09524,1.16799 -1.09524,3.29156 -1.09524,9.1908 0,5.89924 0,15.46751 0,25.03599"
                id="path82"
            />
        </Link>

        <Link href="/processes/process-infrastructuring/protocols/resourcing-case" className="hover-area-link">
            <path
                className="hover-path"
                d="m 253.38629,137.03314 c 0,10.80548 0,21.61076 0,28.13728 0,6.52652 0,8.77375 -0.85201,9.89743 -0.85202,1.12369 -2.55593,1.12369 -6.37709,1.12369 -3.82117,0 -9.75923,0 -15.6974,0"
                stroke="transparent"
                strokeWidth="8"  
                fill="transparent"
                pointerEvents="auto"
            />
            <path
                stroke='url(#gradientPath83)'
                className='linked-path animate-path'
                markerEnd='url(#ArrowWideHeavy)'
                d="m 253.38629,137.03314 c 0,10.80548 0,21.61076 0,28.13728 0,6.52652 0,8.77375 -0.85201,9.89743 -0.85202,1.12369 -2.55593,1.12369 -6.37709,1.12369 -3.82117,0 -9.75923,0 -15.6974,0"
                id="path83"
            />
        </Link>

        {/* Primary rectangles wrapped with links */}
        <Link href="https://register.prisma.events/" passHref className='group cursor-pointer'>
            <g className='transition-transform duration-500 group-hover:scale-[1.03] transform origin-[93px_118px]'>
                <image
                    width="29.896015"
                    height="37.930889"
                    preserveAspectRatio="none"
                    href="/register-screenshot.png"
                    id="image1-28"
                    x="78.760864"
                    y="100.00225"
                    clipPath="url(#clipPathRegistering)" 
                    style={{
                        imageRendering: 'crisp-edges',
                    }}
                />
                <rect
                    className="fill-transparent hover:fill-[#411c51]/70 transition duration-500 ease-in-out"
                    id="rect13Overlay"
                    width="28.679262"
                    height="36.130882"
                    x="79.369247"
                    y="100.90225"
                    ry="5.1096773"
                />
                <rect
                    className="stroke-white fill-none stroke-[0.5px] group-hover:stroke-prisma-a transition-colors duration-500 ease-in-out"
                    id="rect13"
                    width="28.679262"
                    height="36.130882"
                    x="79.369247"
                    y="100.90225"
                    ry="5.1096773"
                />
        
                {/* Text element */}
                <text
                    className="fill-transparent group-hover:fill-white font-custom-bold transition duration-500 ease-in-out"
                    x="85"
                    y="124"
                    style={{ 
                        pointerEvents: 'none',
                        fontFamily: "CustomBold"
                    }} 
                >
                    Reg
                </text>
            </g>
        </Link>
        <Link href="/processes" passHref className='group cursor-pointer'>
            <g className='transition-transform duration-500 group-hover:scale-[1.03] transform origin-[146.935px_176.192px]'>
                <image
                    width="38.853497"
                    height="38.853497"
                    preserveAspectRatio="none"
                    href="/organising-pattern.png"
                    id="image1-2"
                    x="127.50793"
                    y="156.76479"
                    clipPath="url(#clipPathOrganising)"
                    style={{
                        imageRendering: 'crisp-edges',
                    }}
                />
                <rect
                    className="fill-transparent hover:fill-[#411c51]/70 transition duration-500 ease-in-out"
                    id="rect14Overlay"
                    width="28.679262"
                    height="36.130882"
                    x="132.59505"
                    y="158.1261"
                    ry="5.1096773"
                />
                <rect
                className="stroke-white fill-none stroke-[0.5px] group-hover:stroke-prisma-a transition-colors duration-500 ease-in-out"
                id="rect14"
                width="28.679262"
                height="36.130882"
                x="132.59505"
                y="158.1261"
                ry="5.1096773"
                />
        
                {/* Text element */}
                <text
                    className="fill-transparent group-hover:fill-white font-custom-bold transition duration-500 ease-in-out"
                    x="137.5"
                    y="181.5"
                    style={{ 
                        pointerEvents: 'none',
                        fontFamily: "CustomBold"
                    }} 
                >
                    ORG
                </text>
            </g>
        </Link>
        <Link href="/patterns/case-study" passHref className='group cursor-pointer'>
            <g className='transition-transform duration-500 group-hover:scale-[1.03] transform origin-[200.16049px_176.19154px]'>
                <image
                    width="40.047054"
                    height="41.658138"
                    preserveAspectRatio="none"
                    href="/publishing-pattern.png"
                    id="image1-0"
                    x="180.13696"
                    y="157.47911"
                    clipPath="url(#clipPathPublishing)"
                    style={{
                        imageRendering: 'crisp-edges',
                    }}
                />
                <rect
                    className="fill-transparent hover:fill-[#411c51]/70 transition duration-500 ease-in-out"
                    id="rect15Overlay"
                    width="28.679262"
                    height="36.130882"
                    x="185.82086"
                    y="158.1261"
                    ry="5.1096773"
                />
                <rect
                    className="stroke-white fill-none stroke-[0.5px] group-hover:stroke-prisma-a transition-colors duration-500 ease-in-out"
                    id="rect15"
                    width="28.679262"
                    height="36.130882"
                    x="185.82086"
                    y="158.1261"
                    ry="5.1096773"
                />
        
                {/* Text element */}
                <text
                    className="fill-transparent group-hover:fill-white font-custom-bold transition duration-500 ease-in-out"
                    x="191"
                    y="181.5"
                    style={{ 
                        pointerEvents: 'none',
                        fontFamily: "CustomBold"
                    }} 
                >
                    PUB
                </text>
            </g>
        </Link>
        <Link href="/processes/evaluation" passHref className='group cursor-pointer'>
            <g className='transition-transform duration-500 group-hover:scale-[1.03] transform origin-[253.38629px_119.96769px]'>
                <image
                    width="36.13089"
                    height="36.13089"
                    preserveAspectRatio="none"
                    href="/subscribe-tease.png"
                    id="image1-05"
                    x="237.96664"
                    y="100.90225"
                    clipPath="url(#clipPathSubscribing)"
                    style={{
                        imageRendering: 'crisp-edges',
                    }}
                />
                <rect
                    className="fill-transparent hover:fill-[#411c51]/70 transition duration-500 ease-in-out"
                    id="rect16Overlay"
                    width="28.679262"
                    height="36.130882"
                    x="239.04666"
                    y="100.90225"
                    ry="5.1096773"
                />
                <rect
                    className="animated-rect stroke-white fill-none stroke-[0.5px] group-hover:stroke-prisma-a transition-colors duration-500 ease-in-out"
                    id="rect16"
                    width="28.679262"
                    height="36.130882"
                    x="239.04666"
                    y="100.90225"
                    ry="5.1096773"
                />
        
                {/* Text element */}
                <text
                    className="fill-transparent group-hover:fill-white font-custom-bold transition duration-500 ease-in-out"
                    x="244"
                    y="124"
                    style={{ 
                        pointerEvents: 'none',
                        fontFamily: "CustomBold"
                     }}
                >
                    SUB
                </text>
            </g>
        </Link>

        <text x="30.615" y="49.998" style={{
            fontSize: '10.5833px',
            lineHeight: '0.85',
            fontFamily: "CustomBold",
            textAnchor: 'middle',
            fill: '#ffffff',
            strokeWidth: 0.264583
        }}>
            <tspan x="30.615" y="49.998">Data</tspan>
            <tspan x="30.615" y="59.943">Models</tspan>
        </text>
        <text x="30.615" y="117.700" style={{
            fontSize: '10.5833px',
            lineHeight: '0.85',
            fontFamily: "CustomBold",
            textAnchor: 'middle',
            fill: '#ffffff',
            strokeWidth: 0.264583
        }}>
            <tspan x="30.615" y="117.700">prisma-</tspan>
            <tspan x="30.615" y="127.644">hosted</tspan>
        </text>
        <text x="30.615" y="174.871" style={{
            fontSize: '10.5833px',
            lineHeight: '0.85',
            fontFamily: "CustomBold",
            textAnchor: 'middle',
            fill: '#ffffff',
            strokeWidth: 0.264583
        }}>
            <tspan x="30.615" y="174.871">hub-</tspan>
            <tspan x="30.615" y="184.815">hosted</tspan>
        </text>
        <text x="30.615" y="269.437" style={{
            fontSize: '10.5833px',
            lineHeight: '0.85',
            fontFamily: "CustomBold",
            textAnchor: 'middle',
            fill: '#ffffff',
            strokeWidth: 0.264583
        }}>
            <tspan x="30.615" y="269.437">p2p</tspan>
        </text>

        
        <text
            x={95.757233}
            y={54.9}
            className="text-center"
            style={{
                fontSize: '10.5833px',
                lineHeight: '0.85',
                fontFamily: "Custom",
                textAnchor: 'middle',
                fill: '#ffffff',
                strokeWidth: 0.264583
            }}
        >
            <tspan>Stakeholder</tspan>
        </text>
        <text 
            x={137.5} y={54.9}
            style={{
                fontSize: '10.5833px',
                lineHeight: '0.85',
                fontFamily: "Custom",
                fill: '#ffffff',
                strokeWidth: 0.264583
            }}
        >
            <tspan>ALJ</tspan>
        </text>
        <text 
            x={188} 
            y={54.9} 
            style={{
                fontSize: '10.5833px',
                lineHeight: '0.85',
                fontFamily: "Custom",
                fill: '#ffffff',
                strokeWidth: 0.264583
            }}
        >
            <tspan>Case</tspan>
        </text>
        <text
            x={243}
            y={54.9}
            style={{
                fontSize: '10.5833px',
                lineHeight: '0.85',
                fontFamily: "Custom",
                fill: '#ffffff',
                strokeWidth: 0.264583
            }}
        >
            <tspan>Sub</tspan>
        </text>


        {/* Group with multiple rectangles; the entire group will change stroke on hover */}
        <Link href="/group-page" passHref className="animated-link">
            <g id="g193" className="hover-p2p-group">
                <rect
                className="animated-rect stroke-white stroke-[0.5px]"
                id="rect19"
                width="5.7358522"
                height="7.2261763"
                x="197.29257"
                y="241.00029"
                ry="1.0219355"
                />
                <use
                className="animated-rect"
                id="use54"
                xlinkHref="#rect19"
                transform="matrix(1.0474315,0,0,1.0474315,7.470725,-7.8625258)"
                />
                <use
                className="animated-rect"
                id="use56"
                xlinkHref="#rect19"
                transform="matrix(0.98584103,0,0,0.98584103,-11.725607,11.745938)"
                />
                <use
                className="animated-rect"
                id="use57"
                xlinkHref="#rect19"
                transform="matrix(0.95004636,0,0,0.95004636,8.7909571,23.857669)"
                />
                <use
                className="animated-rect"
                id="use58"
                xlinkHref="#rect19"
                transform="matrix(0.98795365,0,0,0.98795365,-12.77916,0.8168064)"
                />
                <use
                className="animated-rect"
                id="use59"
                xlinkHref="#rect19"
                transform="matrix(0.97737753,0,0,0.97737753,-6.3773795,25.962678)"
                />
                <use
                className="animated-rect"
                id="use60"
                xlinkHref="#rect19"
                transform="matrix(1.042621,0,0,1.042621,14.15005,9.4042485)"
                />
                <use
                className="animated-rect"
                id="use61"
                xlinkHref="#rect19"
                transform="matrix(1.0281852,0,0,1.0281852,0.0654375,22.160365)"
                />
                <use
                className="animated-rect"
                id="use62"
                xlinkHref="#rect19"
                transform="matrix(0.97180248,0,0,0.97180248,35.164041,36.404966)"
                />
                <use
                className="animated-rect"
                id="use63"
                xlinkHref="#rect19"
                transform="matrix(0.96556539,0,0,0.96556539,-14.347613,35.299956)"
                />
                <use
                className="animated-rect"
                id="use64"
                xlinkHref="#rect19"
                transform="matrix(0.95442113,0,0,0.95442113,24.842698,40.640374)"
                />
                <use
                className="animated-rect"
                id="use65"
                xlinkHref="#rect19"
                transform="matrix(1.0391399,0,0,1.0391399,31.717432,14.688498)"
                />
                <use
                className="animated-rect"
                id="use66"
                xlinkHref="#rect19"
                transform="matrix(1.0407526,0,0,1.0407526,37.91617,0.7186357)"
                />
                <use
                className="animated-rect"
                id="use67"
                xlinkHref="#rect19"
                transform="matrix(1.0265673,0,0,1.0265673,-37.426562,2.1204719)"
                />
                <use
                className="animated-rect"
                id="use68"
                xlinkHref="#rect19"
                transform="matrix(0.98589657,0,0,0.98589657,-37.718383,20.609232)"
                />
                <use
                className="animated-rect"
                id="use176"
                xlinkHref="#use68"
                transform="matrix(1.0318918,0,0,1.0318918,-38.310276,-11.586368)"
                />
                <use
                className="animated-rect"
                id="use177"
                xlinkHref="#use68"
                transform="matrix(1.0212854,0,0,1.0212854,-48.662274,-18.343392)"
                />
                <use
                className="animated-rect"
                id="use178"
                xlinkHref="#use68"
                transform="matrix(0.95337268,0,0,0.95337268,-30.949481,18.800618)"
                />
                <use
                className="animated-rect"
                id="use179"
                xlinkHref="#use68"
                transform="matrix(0.97312285,0,0,0.97312285,-71.056878,-0.95023219)"
                />
                <use
                className="animated-rect"
                id="use180"
                xlinkHref="#use68"
                transform="matrix(1.011408,0,0,1.011408,-70.897884,7.3455067)"
                />
                <use
                className="animated-rect"
                id="use182"
                xlinkHref="#use68"
                transform="matrix(0.96143465,0,0,0.96143465,-72.900454,18.469007)"
                />
                <use
                className="animated-rect"
                id="use183"
                xlinkHref="#use68"
                transform="matrix(1.0389216,0,0,1.0389216,-64.533371,-6.4081401)"
                />
                <use
                className="animated-rect"
                id="use184"
                xlinkHref="#use68"
                transform="matrix(0.9584564,0,0,0.9584564,-2.5850868,-0.88098342)"
                />
                <use
                className="animated-rect"
                id="use185"
                xlinkHref="#use68"
                transform="matrix(1.0043262,0,0,1.0043262,7.0803537,12.945837)"
                />
                <use
                className="animated-rect"
                id="use186"
                xlinkHref="#use68"
                transform="matrix(1.0042259,0,0,1.0042259,-10.946418,-0.62841994)"
                />
                <use
                className="animated-rect"
                id="use186-8"
                xlinkHref="#use68"
                transform="matrix(1.0042259,0,0,1.0042259,-22.852668,13.129913)"
                />
                <use
                className="animated-rect"
                id="use187"
                xlinkHref="#use68"
                transform="matrix(1.0494245,0,0,1.0494245,-15.377906,7.8543287)"
                />
                <use
                className="animated-rect"
                id="use189"
                xlinkHref="#use68"
                transform="matrix(0.98645776,0,0,0.98645776,-38.108728,18.708509)"
                />
                <use
                className="animated-rect"
                id="use191"
                xlinkHref="#use68"
                transform="matrix(1.0240862,0,0,1.0240862,-59.874503,8.179211)"
                />
                <use
                className="animated-rect"
                id="use193"
                xlinkHref="#use68"
                transform="matrix(1.029373,0,0,1.029373,44.225243,-12.517161)"
                />
            </g>
        </Link>
      </svg>
    </>
  );
};

export default SystemDiagramPI;
