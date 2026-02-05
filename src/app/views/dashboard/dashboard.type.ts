export interface ChartSeries {
    data: number[]
    name: string,
    color?: string
}

export interface RegionData {
    id: string,
    name: string,
    value: number,
    fill?: any
}

interface OverviewSumData {
    value: number,
    name: string
}

export interface OverviewData {
    duration: string[],
    expense: number[],
    income: number[],
    sum?: OverviewSumData[]
}

export interface OverviewDataRating {
  duration: string[],
  zero?: number[],
  one?: number[],
  two?: number[],
  three?: number[],
  four?: number[],
  five?: number[],
  sum?: OverviewSumData[]
}

export interface RecentTransactionData {
    transactionId: number,
    name: string,
    img: string,
    status: 'Approved' | 'Pending' | 'Rejected',
    date: number,
    amount: number
}

export interface RecentReviewData {
    name: string,
    img: string,
    review: string,
    rating: number,
    date: number
}

export interface DeviceStatistic {
  documents:DeviceStatisticData[]
  totalDocuments:string|number
}

export interface DeviceStatisticData {
    extension: string,
    total: string,
}

/* export interface DeviceStatisticData {
    devices: DeviceData[],
    browser: BrowserData[]
} */

interface DeviceData {
    device: string,
    amount: number,
    percent: number
}

interface BrowserData {
    browser: string,
    percent: number
}

export interface CountriesData {
    flag: string,
    country: string,
    users: number,
    percent: number
}
