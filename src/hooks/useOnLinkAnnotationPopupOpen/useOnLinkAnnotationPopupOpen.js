import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import core from 'core';
import DataElements from 'constants/dataElement';
import _debounce from 'lodash/debounce';

const MAX_DELAY = 600;

export default function useOnLinkAnnotationPopupOpen() {
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [isEnterComponent, setIsEnterComponent] = useState(false);

  const hidePopup = useCallback(_debounce(() => {
    setAnnotation(null);
    setIsEnterComponent(false);
    dispatch(actions.closeElement(DataElements.LINK_ANNOTATION_POPUP));
  }, MAX_DELAY), []);

  const handleOnMouseEnter = () => {
    hidePopup.cancel();
    if (!isEnterComponent) {
      setIsEnterComponent(true);
    }
  };

  const handleOnMouseLeave = () => {
    setIsEnterComponent(false);
    hidePopup();
  };

  useEffect(() => {
    const onMouseHover = (e) => {
      if (e.buttons !== 0) {
        return;
      }
      const annotations = core.getAnnotationManager().getAnnotationsByMouseEvent(e, true);
      const linkAnnot = annotations.find((annot) => annot instanceof window.Core.Annotations.Link);

      if (linkAnnot) {
        setAnnotation(linkAnnot);
        dispatch(actions.openElement(DataElements.LINK_ANNOTATION_POPUP));
      } else if (!isEnterComponent) {
        hidePopup();
        return;
      }
      hidePopup.cancel();
    };

    core.addEventListener('mouseMove', onMouseHover);
    return () => {
      core.removeEventListener('mouseMove', onMouseHover);
      hidePopup.cancel();
    };
  }, [annotation, dispatch, hidePopup, isEnterComponent]);

  return { annotation, handleOnMouseEnter, handleOnMouseLeave };
}