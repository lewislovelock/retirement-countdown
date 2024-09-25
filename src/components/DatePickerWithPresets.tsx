"use client"

import * as React from "react"
import { addYears, format, setMonth, setYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerWithPresetsProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePickerWithPresets({
  date,
  setDate
}: DatePickerWithPresetsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(date?.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState<number | undefined>(date?.getMonth())

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year)
    setSelectedYear(newYear)
    if (date) {
      const newDate = setYear(date, newYear)
      setDate(newDate)
    }
  }

  const handleMonthChange = (month: string) => {
    const newMonth = months.indexOf(month)
    setSelectedMonth(newMonth)
    if (date) {
      const newDate = setMonth(date, newMonth)
      setDate(newDate)
    }
  }

  React.useEffect(() => {
    if (date) {
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
    }
  }, [date])

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>选择日期</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-2">
          <Select value={selectedYear?.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={months[selectedMonth || 0]} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            setIsCalendarOpen(false)
          }}
          initialFocus
          month={date}
        />
      </PopoverContent>
    </Popover>
  )
}