import type { FC } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Typography,
	useTheme,
} from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";

interface ModalDialogProps {
	isOpen: boolean;
	isLoading?: boolean;
	title?: string;
	description?: string;
	onCancel: () => void;
	onSubmit: () => void;
	cancelLabel?: string;
	submitLabel?: string;
}

const defaultPaperStyle = {
	borderRadius: "28px",
	width: { xs: "100%", sm: "456px" },
	boxShadow: "none",
};

const ModalDialog: FC<ModalDialogProps> = (props) => {
	const {
		isOpen,
		isLoading = false,
		title,
		description,
		onCancel,
		onSubmit,
		cancelLabel = "Cancel",
		submitLabel = "Confirm",
	} = props;

    const typography = useHonchoTypography();
    const colors = useColors();

	const theme = useTheme();

	return (
		<Dialog
			disableScrollLock
			open={isOpen}
			onClose={onCancel}
			aria-labelledby="dialog-title"
			PaperProps={{ sx: defaultPaperStyle }}
		>
			{title && (
				<DialogTitle>
					<Typography
						variant="labelLarge"
						color={colors.onSurface}
					>
						{title}
					</Typography>
				</DialogTitle>
			)}

			<DialogContent
				sx={{ padding: { xs: "24px 24px 0 24px", sm: "24px 24px 0 24px" } }}
			>
				{description && (
					<Typography
						sx={{ color: "#656369", fontSize: 14 }}
						variant="bodyMedium"
					>
						{description}
					</Typography>
				)}
			</DialogContent>

			<DialogActions sx={{ padding: 3 }}>
				<Grid
					container
					direction="row"
					justifyContent="end"
					alignItems="center"
					gap={1}
				>
					<Button variant="text" onClick={onCancel}>
						{cancelLabel}
					</Button>
					<Button
						variant="text"
						color="error"
						disabled={isLoading}
						onClick={onSubmit}
					>
						{submitLabel}
					</Button>
				</Grid>
			</DialogActions>
		</Dialog>
	);
};

export default ModalDialog;
