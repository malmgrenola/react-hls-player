import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

function ReactHlsPlayer({
    autoplay = false,
    hlsConfig = {
        enableWorker: false
    },
    controls = true,
    width = 500,
    height = 375,
    playerRef = React.createRef(),
    poster,
    videoProps,
    url
}) {
    useEffect(() => {
        let hls = null;

        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            const newHls = new Hls(hlsConfig);

            newHls.attachMedia(playerRef.current);

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                newHls.loadSource(url);

                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (autoplay) {
                        playerRef.current.play();
                    }
                });
            });

            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            });

            hls = newHls;
        }

        _initPlayer();

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [autoplay, hlsConfig, playerRef, url]);

    return (
        <div className="player-area">
            <video
                ref={playerRef}
                className="hls-player"
                controls={controls}
                width={width}
                height={height}
                poster={poster}
                {...videoProps}
            ></video>
        </div>
    );
}

ReactHlsPlayer.propTypes = {
    url: PropTypes.string.isRequired,
    autoplay: PropTypes.bool,
    hlsConfig: PropTypes.object, // https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
    controls: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    poster: PropTypes.string,
    videoProps: PropTypes.object,
    playerRef: PropTypes.object
};

export default ReactHlsPlayer;
