import {AnimationPlayer} from 'angular2/src/core/animation/animation_player';
import {AnimationKeyframe} from 'angular2/src/core/animation/animation_keyframe';
import {AnimationKeyframeStyles} from 'angular2/src/core/animation/animation_keyframe_styles';
import {View} from "ui/core/view";
import enums = require("ui/enums");
import styleProperty = require('ui/styling/style-property');
import colorModule = require('color');
import observable = require('ui/core/dependency-observable');
import animationModule = require('ui/animation');
import types = require("utils/types");

export class NativeAnimationPlayer implements AnimationPlayer {
    private _subscriptions: Function[] = [];
    private _finished = false;
    private animation: animationModule.Animation;
    private properties = [];
    private target: View;
    private keyframe: AnimationKeyframe;
    
    constructor(element: Node, keyframes: AnimationKeyframe[], duration: number, delay: number, easing: string) {

        if (duration === 0) {
            duration = 0.01;
            this.keyframe = keyframes[0];
        }

        if (keyframes.length > 2) {
            throw new Error("NativeScript: Can't play angular animation with multiple keyframes!");
        }

        if (!(element instanceof View)) {
            throw new Error("NativeScript: Can animate only Views!");
        }

        let animationInfo = <animationModule.AnimationDefinition>{};

        this.target = <any>element;

        animationInfo.target = <any>element;
        animationInfo.duration = duration;
        animationInfo.delay = delay;
        animationInfo.iterations = 1;
        animationInfo.curve = easing ? NativeAnimationPlayer.animationTimingFunctionConverter(easing) : enums.AnimationCurve.ease;
        (<any>animationInfo).valueSource = observable.ValueSource.VisualState;

        let keyframe = keyframes.length === 1 ? keyframes[0] : keyframes[1];

        for (let style of keyframe.styles) {
            for (let substyle in style.styles) {
                let value = style.styles[substyle];
                let property = styleProperty.getPropertyByCssName(substyle);
                if (property) {
                    if (typeof value === "string" && property.valueConverter) {
                        value = property.valueConverter(<string>value);
                    }
                    animationInfo[property.name] = value;
                    this.properties.push(property);
                }
                else if (typeof value === "string" && substyle === "transform") {
                    NativeAnimationPlayer.parseTransform(<string>value, animationInfo);
                    if (animationInfo.scale) {
                        this.properties.push(styleProperty.getPropertyByCssName("scaleX"));
                        this.properties.push(styleProperty.getPropertyByCssName("scaleY"));
                    }
                    if (animationInfo.translate) {
                        this.properties.push(styleProperty.getPropertyByCssName("translateX"));
                        this.properties.push(styleProperty.getPropertyByCssName("translateY"));
                    }
                    if (animationInfo.rotate) {
                        this.properties.push(styleProperty.getPropertyByCssName("rotate"));
                    }
                }
            }
        }

        this.animation = new animationModule.Animation([animationInfo], false);
    }

    onDone(fn: Function): void { this._subscriptions.push(fn); }

    private _onFinish() {
        if (!this._finished) {

            for (let property of this.properties) {
                this.target.style._resetValue(<any>property, observable.ValueSource.VisualState);
            }

            this._finished = true;
            this._subscriptions.forEach(fn => fn());
            this._subscriptions = [];
        }
    }

    play(): void {
        if (this.animation) {
            if (this.keyframe) {
                let valueSource = observable.ValueSource.VisualState;
                for (let style of this.keyframe.styles) {
                    for (let substyle in style.styles) {
                        let value = style.styles[substyle];
                        let property = styleProperty.getPropertyByCssName(substyle);
                        if (property) {
                            if (typeof value === "string" && property.valueConverter) {
                                value = property.valueConverter(<string>value);
                            }
                            this.target.style._setValue(property, value, valueSource);
                        }
                        else if (typeof value === "string" && substyle === "transform") {
                            let animationInfo = <animationModule.AnimationDefinition>{};
                            NativeAnimationPlayer.parseTransform(<string>value, animationInfo);
                            if (animationInfo.scale) {
                                this.target.style._setValue(styleProperty.getPropertyByCssName("scaleX"), animationInfo.scale.x, valueSource);
                                this.target.style._setValue(styleProperty.getPropertyByCssName("scaleY"), animationInfo.scale.y, valueSource);
                            }
                            if (animationInfo.translate) {
                                this.target.style._setValue(styleProperty.getPropertyByCssName("translateX"), animationInfo.translate.x, valueSource);
                                this.target.style._setValue(styleProperty.getPropertyByCssName("translateY"), animationInfo.translate.x, valueSource);
                            }
                            if (animationInfo.rotate) {
                                this.target.style._setValue(styleProperty.getPropertyByCssName("rotate"), animationInfo.rotate, valueSource);
                            }
                        }
                    }
                }
            }
            
            this.animation.play()
                .then(() => { this._onFinish(); })
                .catch((e) => {});
        }
    }

    pause(): void {
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
    }

    finish(): void {
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
        // TODO: apply end values
    }
    reset(): void {
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
        // TODO: apply start values
    }

    restart(): void {
        this.reset();
        this.play();
    }

    destroy(): void {
        this.reset();
        this._onFinish();
    }

    static animationTimingFunctionConverter(value): any {
        switch (value) {
            case "ease":
                return enums.AnimationCurve.ease;
            case "linear":
                return enums.AnimationCurve.linear;
            case "ease-in":
                return enums.AnimationCurve.easeIn;
            case "ease-out":
                return enums.AnimationCurve.easeOut;
            case "ease-in-out":
                return enums.AnimationCurve.easeInOut;
            case "spring":
                return enums.AnimationCurve.spring;
            default:
                if (value.indexOf("cubic-bezier(") === 0) {
                    let bezierArr = value.substring(13).split(/[,]+/);
                    if (bezierArr.length !== 4) {
                        throw new Error("Invalid value for animation: " + value);
                    }
                    return enums.AnimationCurve.cubicBezier(
                        NativeAnimationPlayer.bezieArgumentConverter(bezierArr[0]), 
                        NativeAnimationPlayer.bezieArgumentConverter(bezierArr[1]), 
                        NativeAnimationPlayer.bezieArgumentConverter(bezierArr[2]), 
                        NativeAnimationPlayer.bezieArgumentConverter(bezierArr[3]));
                }
                else {
                    throw new Error("Invalid value for animation: " + value);
                }
        }
    }

    static bezieArgumentConverter(value): number {
        let result = parseFloat(value);
        result = Math.max(0.0, result);
        result = Math.min(1.0, result);
        return result;
    }

    static transformConverter(value: any): Object {
        if (value === "none") {
            let operations = {};
            operations[value] = value;
            return operations;
        }
        else if (types.isString(value)) {
            let operations = {};
            let operator = "";
            let pos = 0;
            while (pos < value.length) {
                if (value[pos] === " " || value[pos] === ",") {
                    pos ++;
                }
                else if (value[pos] === "(") {
                    let start = pos + 1;
                    while (pos < value.length && value[pos] !== ")") {
                        pos ++;
                    }
                    let operand = value.substring(start, pos);
                    operations[operator] = operand.trim();
                    operator = "";
                    pos ++;
                }
                else {
                    operator += value[pos ++];
                }
            }
            return operations;
        }
        else {
            return undefined;
        }
    }

    static parseTransform(value: string, animationInfo: any) {
        let newTransform = NativeAnimationPlayer.transformConverter(value);
        let array = new Array<styleProperty.KeyValuePair<styleProperty.Property, any>>();
        let values = undefined;
        for (let transform in newTransform) {
            switch (transform) {
                case "scaleX":
                    animationInfo.scale = { x: parseFloat(newTransform[transform]), y: 1 }; 
                    break;
                case "scaleY":
                    animationInfo.scale = { x: 1, y: parseFloat(newTransform[transform]) }; 
                    break;
                case "scale":
                case "scale3d":
                    values = newTransform[transform].split(",");
                    if (values.length === 2 || values.length === 3) {
                        animationInfo.scale = {
                            x: parseFloat(values[0]),
                            y: parseFloat(values[1])
                        };
                    }
                    break;
                case "translateX":
                    animationInfo.translate = { x: parseFloat(newTransform[transform]), y: 0 };
                    break;
                case "translateY":
                    animationInfo.translate = { x: 0, y: parseFloat(newTransform[transform]) };
                    break;
                case "translate":
                case "translate3d":
                    values = newTransform[transform].split(",");
                    if (values.length === 2 || values.length === 3) {
                        animationInfo.translate = {
                            x: parseFloat(values[0]),
                            y: parseFloat(values[1])
                        };
                    }
                    break;
                case "rotate":
                    let text = newTransform[transform];
                    let val = parseFloat(text);
                    if (text.slice(-3) === "rad") {
                        val = val * (180.0 / Math.PI);
                    }
                    animationInfo.rotate = val;
                    break;
                case "none":
                    animationInfo.scale = { x: 1, y: 1 };
                    animationInfo.translate = { x: 0, y: 0 };
                    animationInfo.rotate = 0;
                    break;
            }
        }
        return array;
    }
}
