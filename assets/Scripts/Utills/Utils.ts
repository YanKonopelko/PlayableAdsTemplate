import { assetManager } from "cc";
import { Mesh } from "cc";
import { Skeleton } from "cc";
import { Prefab } from "cc";
import { Node } from "cc";
import { SpriteFrame } from "cc";
import { Vec2 } from "cc";
import { lerp } from "cc";
import { AudioClip } from "cc";
import { TimeUtils } from "./TimeUtils";

export class Utils {

    public static Shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    public static async LoadMesh(meshName: string,pathToMesh:string = "", pathToBundle: string = "", bundleName: string = "resources") {
        return new Promise<Mesh>(async (resolve, reject) => {
            if (!assetManager.bundles.get(bundleName)) {
                this.LoadBundle(pathToBundle, bundleName)
            }
            var bundle = await assetManager.getBundle(bundleName);
            bundle.load(pathToMesh + `${meshName}/${meshName}`, Mesh, (err, mesh: Mesh) => {
                err && console.warn('missing --- ', meshName);

                err && reject(err);
                mesh && resolve(mesh);
            });
            

        });
    }
    static Lerp (a,b,t):number { return lerp(a,b,t); }
    static async ScaleObjectTo(n:Node, destScale:Vec2, duration:number)
    {
        let startScalex = 1
        let startScaley = 1
        if (n && n.parent){
            startScalex = n.scale.x;
            startScaley = n.scale.y;
        }

        let t = 0;
        while(t < duration)
        {
            if (n && n.parent)
            {
                n.scale.set(Utils.Lerp(startScalex, destScale.x, t/duration),Utils.Lerp(startScaley, destScale.y, t/duration),n.scale.z);
            }
            t += await TimeUtils.WaitFrame()
        }
        if (n && n.parent)
        {
            n.scale.set(destScale.x,destScale.y,n.scale.z);
        }
    }
       public static async LoadAudio(prefabName: string, pathToBundle: string = "", bundleName: string = "resources"): Promise<AudioClip | null> {
        return new Promise<AudioClip | null>(async (resolve) => {
            const fullBundlePath = "assets/" + pathToBundle + bundleName;
    
            const onLoadAudio = (bundle: any) => {
                bundle.load(prefabName, AudioClip, (err, prefab: AudioClip) => {
                    if (err || !prefab) {
                        resolve(null);
                    } else {
                        resolve(prefab);
                    }
                });
            };
    
            const existingBundle = assetManager.bundles.get(bundleName);
            if (!existingBundle) {
                assetManager.loadBundle(fullBundlePath, (err, loadedBundle) => {
                    if (err || !loadedBundle) {
                        resolve(null);
                    } else {
                        // if (!GlobalContext.SessionData.IsRelease)
                        //     console.log("Bundle successfully downloaded: ", loadedBundle);
                        onLoadAudio(loadedBundle);
                    }
                });
            } else {
                onLoadAudio(existingBundle);
            }
        });
    }
    public static async LoadSkeleton(skeletonName: string,pathToMesh:string = "", pathToBundle: string = "", bundleName: string = "resources") {
        return new Promise<Skeleton>(async (resolve, reject) => {
            if (!assetManager.bundles.get(bundleName)) {
                this.LoadBundle(pathToBundle, bundleName)
            }
            var bundle = await assetManager.getBundle(bundleName);
            bundle.load(pathToMesh + `${skeletonName}/UnnamedSkeleton-0`, Skeleton, (err, skeleton: Skeleton) => {
                err && console.warn('missing --- ', skeletonName);

                err && reject(err);
                skeleton && resolve(skeleton);
            });
            

        });
    }
    public static async LoadPrefab(prefabName: string,pathToMesh:string = "", pathToBundle: string = "", bundleName: string = "resources") {
        return new Promise<Prefab>(async (resolve, reject) => {
            if (!assetManager.bundles.get(bundleName)) {
                this.LoadBundle(pathToBundle, bundleName)
            }
            var bundle = await assetManager.getBundle(bundleName);
            bundle.load(pathToMesh + `${prefabName}`, Prefab, (err, prefab: Prefab) => {
                err && console.warn('missing --- ', prefabName);

                err && reject(err);
                prefab && resolve(prefab);
            });
            

        });
    }
    public static async LoadBundle(pathToBundle: string = "", bundleName: string = "resources"){
        let isLoad = true;
        assetManager.loadBundle("assets/" + pathToBundle + bundleName, (err, bundle) => {
            isLoad = false;
            if (err) {
                return null;
            }
        }
        )
        await TimeUtils.WaitUntil(()=>{return !isLoad});
    }

    public static async LoadSpriteFrame(imageName: string,pathToImage:string = "", pathToBundle: string = "", bundleName: string = "resources"):Promise<SpriteFrame> {
        return new Promise<SpriteFrame>(async (resolve, reject) => {
            if (!assetManager.bundles.get(bundleName)) {
               await this.LoadBundle(pathToBundle, bundleName)
            }
            var bundle = await assetManager.getBundle(bundleName);
            bundle.load(pathToImage + imageName + "/spriteFrame", SpriteFrame, (err, spriteFrame: SpriteFrame) => {
                err && console.warn('missing --- ', imageName);
        
                err && reject(err);
                spriteFrame && resolve(spriteFrame);
            });
            

        });
    }

   
    public static CopyNodeValuesToAnotherNode(from:Node,to:Node){
        if(!from || !to) {
            console.warn("Have no From or To copy node");
            return;
        }
        if(from.parent)
            to.setParent(from.parent);
        to.setPosition(from.position);
        to.setRotation(from.rotation);
        to.setScale(from.scale);
        to.layer = from.layer;
        to.mobility = from.mobility;
    }
}