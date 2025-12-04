import { cn } from "@/lib/utils";


function ProductPrice({ value, className }: { value: string; className?: string; }) {
    const [priceWholeNumber, priceDecimalValue] = value.split('.');
    
  return (
      <p className={cn('text-2xl', className)}>
          <span className="text-xs align-super">{priceWholeNumber[0]}</span>
           {priceWholeNumber.slice(1) }
          <span className="text-xs align-super">.{priceDecimalValue}</span>
      </p>
  )
}

export default ProductPrice