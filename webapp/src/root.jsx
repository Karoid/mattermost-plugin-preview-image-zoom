import { useContext } from 'react';

import {getFilePreviewUrl, getFileDownloadUrl} from 'mattermost-redux/utils/file_utils';

import './root.scss';

import {TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';

import MattermostContext from './contexts/MattermostContext';

function Root() {
    const mmProps = useContext(MattermostContext);
    const { fileInfo } = mmProps;

    const isExternalFile = !fileInfo.id;

    let fileUrl;
    let previewUrl;
    if (isExternalFile) {
        fileUrl = fileInfo.link;
        previewUrl = fileInfo.link;
    } else {
        fileUrl = getFileDownloadUrl(fileInfo.id);
        previewUrl = fileInfo.has_preview_image ? getFilePreviewUrl(fileInfo.id) : fileUrl;
    }

    return (
        <div className='image_preview__container'>
            <TransformWrapper
                onInit={({zoomOut}) => {
                    // 컴포넌트 초기화 시 zoomOut 실행하여 가운데 정렬
                    setTimeout(() => {
                        zoomOut();
                    }, 100);
                }}
                onZoom={() => {
                    const imgElement = document.querySelector('.image_preview__image');
                    imgElement.classList.add('image_preview__image--zoomed');
                    if (imgElement.src !== fileUrl) {
                        imgElement.src = fileUrl;
                    }
                }}
            >
                {({zoomIn, zoomOut, resetTransform}) => (
                    <>
                        <div className='image_preview_zoom_actions__actions'>
                            <button
                                onClick={() => zoomIn()}
                                className='image_preview_zoom_actions__action-item'
                            >
                                <i className='icon icon-plus'/>
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className='image_preview_zoom_actions__action-item'
                            >
                                <i className='icon icon-minus'/>
                            </button>
                            <button
                                onClick={() => resetTransform()}
                                className='image_preview_zoom_actions__action-item'
                            >
                                <i className='icon icon-refresh'/>
                            </button>
                        </div>
                        <TransformComponent>
                            <img
                                className='image_preview__image'
                                loading='lazy'
                                data-testid='imagePreview'
                                alt={'preview url image'}
                                src={previewUrl}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default Root;
