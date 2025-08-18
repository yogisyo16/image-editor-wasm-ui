import type { FC } from "react";
import ModalDialog from "../modal/HModalDialog";

interface Props {
	isLoading: boolean;
	onCancel: VoidFunction;
	onSubmit: VoidFunction;
}

const HPresetDeleteDialog: FC<Props> = (props) => {
    const { isLoading, onCancel, onSubmit } = props;

    return (
        <ModalDialog
            isOpen
            title="Delete preset?"
            description="The preset will be permanently removed."
            isLoading={isLoading}
            onCancel={onCancel}
            submitLabel="Delete"
            onSubmit={onSubmit}
        />
    );
};  

export default HPresetDeleteDialog;