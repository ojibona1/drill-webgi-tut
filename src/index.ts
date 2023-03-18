import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,

    //addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger)

async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    //await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/drill.glb")

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

    function setupScrollAnimation() {
        const tl = gsap.timeline()

        //first section
        tl
        .to(position, {
                x: 1.56,
                y: -2.26,
                z: -3.85,
                scrollTrigger: {
                    trigger: "#second",
                    start: "top bottom",
                    end: "top top",
                    scrub: true
                }, onUpdate
            })
            .to(".section--one", {
                xPercent : '-150',
                opacity : 0,
                scrollTrigger: {
                    trigger: "#second",
                    start: "top bottom",
                    end: "top 80%",
                    scrub: true
                }
            })
            .to(target, {
                x: -1.57,
                y: 1.99,
                z: -0.37,
                scrollTrigger: {
                    trigger: "#second",
                    start: "top bottom",
                    end: "top top",
                    scrub: true
                },
            })
            // last section
            .to(position, {
                x : -3.8,
                y : -1.6,
                z : 2.74,
                scrollTrigger : {
                    trigger : "#third",
                    start : 'top bottom',
                    end : 'top top',
                    markers : true,
                    scrub: true
                }, onUpdate
            })
            .to(target, {
                x : -1.5,
                y : 2.28,
                z : -0.4,
                scrollTrigger : {
                    trigger : "#third",
                    end : 'top bottom',
                    start : 'top top',
                    markers : true,
                    scrub: true
                }
            })
            
    }
    setupScrollAnimation()

    // webgi update
    let needsUpdate = true

    function onUpdate() {
        needsUpdate = true
        viewer.renderer.resetShadows()
        viewer.setDirty()
    }
    viewer.addEventListener('preFrame', () => {
        if (needsUpdate) {
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false
        }
    })

}

setupViewer()
