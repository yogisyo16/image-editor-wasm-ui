import React from "react";
import { Alert } from "@mui/material";
import useColors from "@/colors";

export default function HAlertBox() {
    const colors = useColors();
    return (
        <Alert icon={<img src="v1/svg/check-ratio-editor.svg"/>} 
            sx={{ position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translate(-50%, -50%)',

                width: { xs: '90%', sm: 'auto' },
                minWidth: '270px',
                zIndex: 1300,

                backgroundColor: colors.onBackground,
                color: colors.surface 
            }}
        >
            Saved
        </Alert>
    );
}