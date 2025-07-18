import React from "react";
import { Stack, Typography, IconButton, CardMedia } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    exposureScore: number;
    contrastScore: number;
    highlightsScore: number;
    shadowsScore: number;
    whitesScore: number;
    blacksScore: number;
}

export default function HBulkAccordionColorAdjustmentLight(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();
    
    return(
        <>
            <Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Exposure</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.exposureScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }}/>
                    </IconButton>
                    <IconButton value={props.exposureScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.exposureScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.exposureScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Contrast</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.contrastScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }} />
                    </IconButton>
                    <IconButton value={props.contrastScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.contrastScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.contrastScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pb: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Highlights</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.highlightsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }} />
                    </IconButton>
                    <IconButton value={props.highlightsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.highlightsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }} />
                    </IconButton>
                    <IconButton value={props.highlightsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }} />
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Shadows</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.shadowsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }} />
                    </IconButton>
                    <IconButton value={props.shadowsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.shadowsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.shadowsScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Whites</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.whitesScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }} />
                    </IconButton>
                    <IconButton value={props.whitesScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.whitesScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.whitesScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: "8px", pt: "16px" }}>
                    <Typography sx={{...typography.bodyMedium}}>Blacks</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ p: "0px", m: "0px", pt: "2px", pb: "2px" }}>
                    <IconButton value={props.blacksScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button.svg" sx={{ mr: "2px" }} />
                    </IconButton>
                    <IconButton value={props.blacksScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button.svg" sx={{ mr: "3px" }} />
                    </IconButton>
                    <IconButton value={props.blacksScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-increment-button-right.svg" sx={{ ml: "3px" }}/>
                    </IconButton>
                    <IconButton value={props.blacksScore}
                    sx={{
                        width: "38.5px",
                        height: "24px",
                        py: "2px",
                        mr: "12px",
                        border: "1px solid white",
                        borderRadius: "100px",
                    }}>
                        <CardMedia component="img" image="/v1/svg/bulk-editor-max-button-right.svg" sx={{ ml: "2px" }}/>
                    </IconButton>
                </Stack>
            </Stack>
        </>
    )
}