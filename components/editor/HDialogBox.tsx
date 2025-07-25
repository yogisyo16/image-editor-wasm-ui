import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, IconButton,
    Stack,
    Typography,
} from "@mui/material";
import useColors from "@/colors";
import React, {ReactElement} from "react";
import {CloseOutlined} from "@mui/icons-material";

interface Props {
    title: React.ReactNode
    description: React.ReactNode | ReactElement;
    onClose?: () => void;
    action?: React.ReactNode
}

export function HBaseDialog(props: Props) {
    const colors = useColors();

    return (
        <Dialog
            disableScrollLock
            open={true}
            onClose={() => {}}
            aria-labelledby="responsive-dialog-title"
            PaperProps={{
                sx: {
                    borderRadius: "28px",
                    maxWidth: { xs: 328, sm: "456px", md: "456px" },
                    //maxHeight: 306,
                    margin: { xs: 0, sm: "auto" },
                },
            }}>
            <DialogContent
                sx={{ padding: { xs: "24px 24px 0 24px", sm: "24 24px 0 24px" } }}>
                <Stack spacing={2} direction="column">
                    <Stack direction={"row"} alignItems="center" justifyContent="space-between">
                        <Typography
                            color={colors.onSurface}
                            variant="labelLarge">
                            {props.title}
                        </Typography>
                        <CloseButton onClick={props.onClose}/>
                    </Stack>

                    <Typography
                        variant="bodyMedium"
                        color={colors.onSurface}>
                        {props.description}
                    </Typography>
                </Stack>
            </DialogContent>
            {props.action && (
                <DialogActions sx={{ padding: 3 }}>
                    <Stack
                        direction="row"
                        justifyContent="end"
                        alignItems="center"
                        gap={1}>
                        {props.action}
                    </Stack>
                </DialogActions>
            )}
        </Dialog>
    );
}

interface ButtonProps {
    text: string
    onClick: () => void;
}

export function PositiveButton(props: ButtonProps) {
    const colors = useColors();

    return (
        <Button
            variant="text"
            sx={{
                ":hover": {
                    backgroundColor: "transparent",
                },
            }}
            onClick={props.onClick}>
            <Typography
                variant="buttonMedium"
                color={colors.onSurface}>
                {props.text}
            </Typography>
        </Button>
    )
}

export function NegativeButton(props: ButtonProps) {
    const colors = useColors();

    return (
        <Button
            variant="text"
            sx={{
                borderRadius: 100,
                color: colors.error,
                ":hover": {
                    backgroundColor: "transparent",
                },
            }}
            disabled={false}
            onClick={props.onClick}>
            {props.text}
        </Button>
    )
}

interface CloseButtonProps {
    onClick?: () => void;
}

function CloseButton(props: CloseButtonProps) {
    return (
        <IconButton onClick={props.onClick}>
            <CloseOutlined htmlColor="black" />
        </IconButton>
    )
}