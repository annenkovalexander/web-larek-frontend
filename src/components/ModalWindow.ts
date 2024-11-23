import { ModalComponentData, ModalWindowSettings } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

const detectClickOutside = (element: HTMLElement, activeClass: string) => {
    const handleClickOutside = (event: any) => {
        if (element.classList.contains(activeClass) && event.target.contains(element)){
            element.classList.remove(activeClass);
        }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
        document.removeEventListener('click', handleClickOutside);
    }
}

export class ModalComponent extends Component<ModalComponentData> {
    protected _contentElement: HTMLElement;
    protected _modalWindowSettings: ModalWindowSettings;
    protected _contentElementChild: HTMLElement;

    constructor(protected readonly container: HTMLElement, modalWindowSettings: ModalWindowSettings, events: IEvents){
        super(container);
        const closeButton = ensureElement<HTMLButtonElement>(modalWindowSettings.modalCloseButton, container);
        closeButton.addEventListener('click', () => {
            if (container.classList.contains(modalWindowSettings.modalActiveClass))
                container.classList.remove(modalWindowSettings.modalActiveClass)
        })
        this._contentElement = ensureElement<HTMLElement>(modalWindowSettings.modalContent, container);
        this._modalWindowSettings = modalWindowSettings;
        detectClickOutside(this.container, this._modalWindowSettings.modalActiveClass);
    }

    set contentElement(value: HTMLElement) {
        const children = Array.from(this._contentElement.childNodes);
        children.forEach(child => {
            this._contentElement.removeChild(child);
        });
        this._contentElement.append(value);
    }

    set openFlag(value: boolean){
        if (value && !this.container.classList.contains(this._modalWindowSettings.modalActiveClass)){
            this.container.classList.add(this._modalWindowSettings.modalActiveClass);
        }
        else if (!value && this.container.classList.contains(this._modalWindowSettings.modalActiveClass)){
            this.container.classList.remove(this._modalWindowSettings.modalActiveClass);
        }
            
    }
}