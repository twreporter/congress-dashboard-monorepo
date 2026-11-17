'use client'
import React, { useId, type FC } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'

// 單一資料點：某個會期（term）的發言/議案數量
export type ChartDataPoint = {
  term: string
  count: number
}
// 固定長度 5，由舊到新排列；若為新進議題，前面的會期以 count: 0 補齊
export type ChartData = ChartDataPoint[]

const CHART_HEIGHT = 36
// line stroke 上下各留 4px；area fill 只留上方 4px（底部延伸到圖表底緣）
const LINE_PADDING_Y = 4
const STROKE_WIDTH = 2
// 讓折線端點的圓角線帽（round linecap）不會被裁切
const POINT_INSET_X = STROKE_WIDTH

const MOBILE_WIDTH = 80
const DESKTOP_WIDTH = 100

type Point = { x: number; y: number }

const getLineYPositions = (counts: number[]): number[] => {
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const innerTop = LINE_PADDING_Y
  const innerBottom = CHART_HEIGHT - LINE_PADDING_Y

  // 五筆數字都相同（含全部為 0）時，無法做 min-max 正規化，改畫置中水平線
  if (max === min) {
    const centerY = (innerTop + innerBottom) / 2
    return counts.map(() => centerY)
  }

  return counts.map((count) => {
    const normalized = (count - min) / (max - min)
    return innerBottom - normalized * (innerBottom - innerTop)
  })
}

const getXPositions = (width: number, pointCount: number): number[] => {
  const usableWidth = width - POINT_INSET_X * 2
  return Array.from(
    { length: pointCount },
    (_, i) => POINT_INSET_X + (i / (pointCount - 1)) * usableWidth
  )
}

const buildChartPaths = (chartData: ChartData, width: number) => {
  const counts = chartData.map((d) => d.count)
  const xPositions = getXPositions(width, counts.length)
  const yPositions = getLineYPositions(counts)
  const points: Point[] = xPositions.map((x, i) => ({ x, y: yPositions[i] }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
    .join(' ')

  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const areaPath = `${linePath} L ${lastPoint.x},${CHART_HEIGHT} L ${firstPoint.x},${CHART_HEIGHT} Z`

  return { linePath, areaPath }
}

const MobileSvgWrapper = styled.div`
  line-height: 0;
  ${mq.desktopAndAbove`
    display: none;
  `}
`

const DesktopSvgWrapper = styled.div`
  display: none;
  line-height: 0;
  ${mq.desktopAndAbove`
    display: block;
  `}
`

type ChartSvgProps = {
  chartData: ChartData
  width: number
  gradientId: string
}

const ChartSvg: FC<ChartSvgProps> = ({ chartData, width, gradientId }) => {
  const { linePath, areaPath } = buildChartPaths(chartData, width)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={CHART_HEIGHT}
      viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
      fill="none"
    >
      <path opacity="0.2" d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#9B051E"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={width / 2}
          y1={LINE_PADDING_Y}
          x2={width / 2}
          y2={CHART_HEIGHT}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B051E" />
          <stop offset="1" stopColor="#9B051E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

type ChartProps = {
  chartData: ChartData
}

const Chart: FC<ChartProps> = ({ chartData }) => {
  const gradientId = useId()
  return (
    <>
      <MobileSvgWrapper>
        <ChartSvg
          chartData={chartData}
          width={MOBILE_WIDTH}
          gradientId={`${gradientId}-mobile`}
        />
      </MobileSvgWrapper>
      <DesktopSvgWrapper>
        <ChartSvg
          chartData={chartData}
          width={DESKTOP_WIDTH}
          gradientId={`${gradientId}-desktop`}
        />
      </DesktopSvgWrapper>
    </>
  )
}
export default Chart
