import { useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary?: any;
  }
}

interface UploadWidgetProps {
  children: (props: {
    cloudinary: any;
    widget: React.MutableRefObject<any>;
    open: () => void;
  }) => React.ReactElement;
  onUpload?: (error: any, result: any, widget: any) => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ children, onUpload }) => {
  const widget = useRef<any>(null);

  useEffect(() => {
    if (!window.cloudinary) return;

    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget();
      }
    }

    if ("requestIdleCallback" in window) {
      requestIdleCallback(onIdle);
    } else {
      setTimeout(onIdle, 1);
    }

    return () => {
      widget.current?.destroy();
      widget.current = null;
    };
  }, []);

  function createWidget() {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn(
        "Kindly ensure you have the cloudName and UploadPreset setup in your .env file at the root of your project."
      );
      return null;
    }

    return window.cloudinary?.createUploadWidget(
      { cloudName, uploadPreset },
      (error: any, result: any) => {
        if (
          (error || result.event === "success") &&
          typeof onUpload === "function"
        ) {
          onUpload(error, result, widget);
        }
      }
    );
  }

  function open() {
    if (!widget.current) {
      widget.current = createWidget();
    }
    widget.current?.open();
  }

  return <>{children({ cloudinary: window.cloudinary, widget, open })}</>;
};

export default UploadWidget;
