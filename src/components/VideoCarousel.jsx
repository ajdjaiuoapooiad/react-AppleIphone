import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState} from 'react'
import {hightlightsSlides} from '../constants'
import { pauseImg, playImg, replayImg } from '../utils';


const VideoCarousel = () => {

    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video,setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastvideo: false,
        isPlaying: false, 
    })
    const [loadedData,setLoadedData] = useState([]);
    const {isEnd,startPlay,videoId,isLastvideo,isPlaying} = video;

    
    useGSAP(() => {
        gsap.to('#video',{
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none'
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                     
                }))
            }
        })
    },[isEnd,videoId ])

    useEffect(() => {
        if(loadedData.length > 3){
          if(!isPlaying){
              videoRef.current[videoId].pause();
          }else{
              startPlay && videoRef.current[videoId].play();
          }
        }
      }, [startPlay,videoId,isPlaying,loadedData]);

    const handleLoadedMetadata = (i,e) => setLoadedData((pre) => [...pre,e]);

    useEffect(() => {
        const currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]){
            let anim = gsap.to(span[videoId],{
                onUpdate: () => {

                },
                onComplete: () => {

                }
            })
        }
    },[videoId,startPlay])

    const handleProcess = (type,i) => {
        switch(type) {
            case 'video-end':
                setVideo((pre) => ({...pre,isEnd: true,videoId: i + 1}));
                break;
            case 'video-last':
                setVideo((pre) => ({...pre,isLastvideo: true}));
                break;
            case 'video-reset':
                    setVideo((pre) => ({...pre,isLastvideo: false,
                        videoId: 0}));
                break;
            case 'play':
                setVideo((pre) => ({...pre,isPlaying: !pre.isPlaying}));
            break;

            default:
                return video;
        }
    };
    

    return (

        
        <>
        <h1>videocarousel</h1>

            <div className='flex items-center'>
                {hightlightsSlides.map((list,i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className='video-carousel_container'>

                            {/* video部分------------- */}
                            <div className='w-full h-full 
                            flex-center rounded-3xl overflow-hidden bg-black'>
                                <video id="video" 
                                    playsInline={true} 
                                    preload='auto' 
                                    muted
                                // 追加--------------------
                                    ref = {(el) => (videoRef.current[i] = el)}
                                    onPlay={() => {
                                        setVideo((preVideo) => ({
                                            ...preVideo,isPlaying: true
                                        }))
                                    }}
                                    onLoadedMetadata={(e) => 
                                        handleLoadedMetadata(i,e)
                                    }
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            
                            {/* comment部分------------------- */}
                            <div className="absolute top-12 left-[5%] z-10 ">
                                {list.textLists.map((text) => (
                                    <p key={text} className="md:text-2xl text-xl font-medium"  >
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/*screen-btn部分--------------------  */}
            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 
                backdrop-blur rounded-full">
                    {videoRef.current.map((_,i) => (
                        <span key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 
                            rounded-full relative cursor-pointer"
                        >
                            <span className="absolute h-full w-full rounded-full"
                            ref={(el) => (videoSpanRef.current[i]=el)}
                            />
                        </span>
                    ))}
                </div>

                <button className="control-btn">
                    <img src={isLastvideo? replayImg: !isPlaying? playImg: pauseImg
                        }
                        alt={isLastvideo? "replay": !isPlaying? "play": "pause"
                        } 
                        onClick={isLastvideo? () => handleProcess("video-reset")
                            : !isPlaying? () => handleProcess("play"): () => handleProcess("pause")
                        }
                    />
                </button>

            </div>
        </>
    );
};


export default VideoCarousel