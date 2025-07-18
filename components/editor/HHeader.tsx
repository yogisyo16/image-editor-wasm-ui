import React, { useState } from "react";
import { Button, Stack, IconButton, CardMedia, MenuItem, ListItemText , ListItemIcon, Typography, Menu } from "@mui/material";
import useHonchoTypography from "@/honchoTheme";
import useColors from "@/colors";
import HModalCopyEdit from "./HModalEditorDekstop";
import useIsMobile from "@/utils/isMobile";

interface Props {
  onBack: () => void;
  onSettings: () => void;
  onPublish: () => void;
  onDownload: () => void;
  onPrint: () => void;
  onOption: () => void;
  onRevert: () => void;
  onCopyEdit: () => void;
  onPasteEdit: () => void;
  isPublished: boolean;
  isSettingsActive: boolean;
}


export default function HHeader(props: Props) {
    const typography = useHonchoTypography();
    const colors = useColors();

    const [anchorMenu, setanchorMenu] = useState<null | HTMLElement>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const open = Boolean(anchorMenu);
    
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setanchorMenu(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setanchorMenu(null);
    };
    
    const handleMenuItemClick = (action: () => void) => {
        action();
        handleMenuClose();
    };

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    return (
    <>
      <Stack direction="row" justifyContent="space-between" width="100%"> 
        <Stack direction="row" justifyContent="start">
          <IconButton aria-label="back" onClick={props.onBack}>
            <CardMedia title="back" src="svg/Back.svg" component="img" />
          </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ pt: "20px", pb: "12px"}} spacing={0.1}>
          <Button variant={props.isPublished ? "contained" : "outlined"} size="small" onClick={props.onPublish} 
            sx={{
              backgroundColor: props.isPublished ? colors.surface : 'transparent',
              color: props.isPublished ? colors.onSurface : colors.surface,
              borderColor: colors.surface,
              '&.MuiButton-outlined': {
                color: colors.surface,
                borderColor: colors.surface,
              }
            }}>
            {props.isPublished ? "Published" : "Publish"}
          </Button>
          <IconButton aria-label="publish" onClick={props.onPublish} sx={{ color: colors.outlineVariant }}>
                <CardMedia component="img" image="/v1/svg/share-editor.svg" />
          </IconButton>
          <IconButton aria-label="settings" onClick={props.onSettings} sx={{ color: colors.outlineVariant }}>
                <CardMedia component="img" image={props.isSettingsActive ? "/v1/svg/settings-active-editor.svg" : "/v1/svg/settings-inactive-editor.svg"} />
          </IconButton>
          <IconButton aria-label="download" onClick={props.onDownload} sx={{ color: colors.outlineVariant }}>
                <CardMedia component="img" image="/v1/svg/download-editor.svg" />
          </IconButton>
          <IconButton aria-label="print" onClick={props.onPrint} sx={{ color: colors.outlineVariant }}>
                <CardMedia component="img" image="/v1/svg/printer-editor.svg" />
          </IconButton>
          <IconButton 
                aria-label="option" 
                onClick={handleMenuClick}
                sx={{ color: colors.outlineVariant }}
                aria-controls={open ? 'options-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
          >
              <CardMedia component="img" image="/v1/svg/dots-editor.svg" />
          </IconButton>
          <Menu
                id="options-menu"
                anchorEl={anchorMenu}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                'aria-labelledby': 'options-button',
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                paper: {
                    sx: {
                    backgroundColor: colors.onBackground,
                    color: colors.surface,
                    border: `1px solid ${colors.outlineVariant}`,
                    },
                },
                }}
          >
            <MenuItem onClick={() => handleMenuItemClick(props.onRevert)}>
                <ListItemIcon>
                    <CardMedia component="img" image="/v1/svg/revert-editor.svg" sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText>Revert to original</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleModalOpen}>
                <ListItemIcon>
                    <CardMedia component="img" image="/v1/svg/copy-editor.svg" sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText>Copy edits</ListItemText>
            </MenuItem>
            <HModalCopyEdit 
                modalOpen={modalOpen}
                modalClose={handleModalClose}
            />
            <MenuItem onClick={() => handleMenuItemClick(props.onPasteEdit)}>
                <ListItemIcon>
                    <CardMedia component="img" image="/v1/svg/paste-editor.svg" sx={{ width: 20, height: 20 }} />
                </ListItemIcon>
                <ListItemText>Paste edits</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </>
    )
}