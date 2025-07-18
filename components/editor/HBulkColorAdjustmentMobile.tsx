import React from "react";
import HSliderPresenceMobile from "./HSliderPresenceMobile";
import HBulkColorMobile from "./HBulkColorMobile";
import HBulkLightMobile from "./HBulkLightMobile";
import HBulkDetailsMobile from "./HBulkDetailsMobile";

interface Props {
    activeSubPanel: string;
    tempScore: number;
    tintScore: number;
    exposureScore: number;
    highlightsScore: number;
    shadowsScore: number;
    whitesScore: number;
    blacksScore: number;
    saturationScore: number;
    contrastScore: number;
    clarityScore: number;
    sharpnessScore: number;
    onTempChange: (value: number) => void;
    onTintChange: (value: number) => void;
    onExposureChange: (value: number) => void;
    onHighlightsChange: (value: number) => void;
    onShadowsChange: (value: number) => void;
    onWhitesChange: (value: number) => void;
    onBlacksChange: (value: number) => void;
    onSaturationChange: (value: number) => void;
    onContrastChange: (value: number) => void;
    onClarityChange: (value: number) => void;
    onSharpnessChange: (value: number) => void;
}

export default function HBulkColorAdjustmentMobile(props: Props) {
    switch (props.activeSubPanel) {
        case 'color':
            return (
                <HBulkColorMobile
                    tempScore={props.tempScore}
                    tintScore={props.tintScore}
                    onTempChange={props.onTempChange}
                    onTintChange={props.onTintChange}
                    saturationScore={props.saturationScore}
                    onSaturationChange={props.onSaturationChange}
                />
            );
        case 'light':
            return (
                <HBulkLightMobile
                    contrastScore={props.contrastScore}
                    exposureScore={props.exposureScore}
                    highlightsScore={props.highlightsScore}
                    shadowsScore={props.shadowsScore}
                    whitesScore={props.whitesScore}
                    blacksScore={props.blacksScore}
                    onExposureChange={props.onExposureChange}
                    onContrastChange={props.onContrastChange}
                    onHighlightsChange={props.onHighlightsChange}
                    onShadowsChange={props.onShadowsChange}
                    onWhitesChange={props.onWhitesChange}
                    onBlacksChange={props.onBlacksChange}
                />
            );
        case 'details':
            return (
                <HBulkDetailsMobile
                    clarityScore={props.clarityScore}
                    sharpnessScore={props.sharpnessScore}
                    onClarityChange={props.onClarityChange}
                    onSharpnessChange={props.onSharpnessChange}
                />
            );
        default:
            return null;
    }
}