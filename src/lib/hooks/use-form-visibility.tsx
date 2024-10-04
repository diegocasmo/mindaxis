import { useState, useRef, useEffect, RefObject } from "react";

type UseFormVisibilityProps = {
  initialVisibility?: boolean;
};

type UseFormVisibilityReturn = {
  isFormVisible: boolean;
  setIsFormVisible: (value: boolean) => void;
  cardRef: RefObject<HTMLDivElement>;
};

export const useFormVisibility = ({
  initialVisibility = false,
}: UseFormVisibilityProps = {}): UseFormVisibilityReturn => {
  const [isFormVisible, setIsFormVisible] = useState(initialVisibility);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsFormVisible(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFormVisible(false);
      }
    };

    if (isFormVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isFormVisible]);

  return { isFormVisible, setIsFormVisible, cardRef };
};
