import {useRates} from "~/providers/items_providers";
import {type Bands, BandsSelect} from "~/components/controls/BandsSelect/BandsSelect";
import {type FocusEventHandler, useCallback} from "react";
import type {BandedRateBandsPost} from "../../../client";

interface Props {
    label?: string
    description?: string
    required?: boolean
    value?: BandedRateBandsPost
    defaultValue?: BandedRateBandsPost
    onChange?: (value: BandedRateBandsPost) => void
    onFocus?: FocusEventHandler<HTMLDivElement>
    onBlur?: FocusEventHandler<HTMLDivElement>
    error?: any
}

function mapExternalValue(bands: BandedRateBandsPost): Bands {
    return {
        remainder_value: bands.remainder_rate_id || null,
        bands: bands.bands.map((band) => ({
            value: band.rate_id || null,
            size: typeof band.size === "string" ? parseFloat(band.size) : band.size || 0,
        }))
    }
}

function mapInternalValue(bands: Bands): BandedRateBandsPost {
    return {
        remainder_rate_id: bands.remainder_value,
        bands: bands.bands.map((band) => ({
            rate_id: band.value,
            size: band.size,
        }))
    }
}

export function RateBandsSelect(
    {
        label,
        description,
        required,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        error,
    }: Props
) {
    const [rates] = useRates()

    const onInternalChange = useCallback((value: Bands) => {
        onChange && onChange(mapInternalValue(value))
    }, [onChange])

    return <BandsSelect
        label={label}
        description={description}
        required={required}
        onFocus={onFocus}
        onBlur={onBlur}
        error={error}
        data={rates.map(({id, name}) => ({
            value: id,
            label: name,
        }))}
        value={value ? mapExternalValue(value) : undefined}
        defaultValue={defaultValue ? mapExternalValue(defaultValue) : undefined}
        onChange={onInternalChange}
    />
}
