import React from "react";
import { TextField } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface Props {
    valueName: string;
    setName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function HTextField(props: Props) {
    const colors = useColors();
    const typography = useHonchoTypography();
    
    return (
        <>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Preset Name"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={props.valueName}
                onChange={props.setName}
                sx={{ 
                    backgroundColor: "#F6F6F6", 
                    p: "7px",
                    borderRadius: "6px",
                    '& .MuiInputLabel-root': {
                        pt: '10px',
                        pl: '10px',
                    },
                }}
            />
        </>
    );
}