import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from './badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './command'
import { cn } from '../lib/utils'

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  values: string[]
  onValuesChange: (values: string[]) => void
  options: Option[]
  placeholder?: string
}

export function MultiSelect({
  values,
  onValuesChange,
  options,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter(option => 
    values.includes(option.value)
  )

  return (
    <Command className="overflow-visible bg-white">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="hover:bg-secondary"
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onValuesChange(values.filter((value) => value !== option.value))
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() =>
                  onValuesChange(values.filter((value) => value !== option.value))
                }
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandInput
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="h-full overflow-auto">
              {options.map((option) => {
                const isSelected = values.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onValuesChange(
                        isSelected
                          ? values.filter((value) => value !== option.value)
                          : [...values, option.value]
                      )
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
} 