import {
	Component,
	Input,
	Output,
	EventEmitter,
	forwardRef,
	OnInit,
	ElementRef,
	HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
	trigger,
	state,
	style,
	transition,
	animate
} from '@angular/animations';

export interface SelectOption {
	value: string;
	label: string;
	hovered?: boolean;
}

@Component({
	selector: 'app-custom-select',
	templateUrl: './custom-select.component.html',
	styleUrls: ['./custom-select.component.css'],
	animations: [
		trigger('dropdownAnimation', [
			state(
				'void',
				style({
					opacity: 0,
					transform: 'translateY(-10px)'
				})
			),
			state(
				'*',
				style({
					opacity: 1,
					transform: 'translateY(0)'
				})
			),
			transition('void <=> *', [animate('0.2s ease-in-out')])
		])
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomSelectComponent),
			multi: true
		}
	]
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
	@Input() options: SelectOption[] = [];
	@Input() placeholder: string = 'Seleccionar...';
	@Input() disabled: boolean = false;
	@Input() label: string = '';
	@Input() required: boolean = false;
	@Input() invalid: boolean = false;

	@Output() selectionChange = new EventEmitter<string>();

	selectedValue: string = '';
	selectedLabel: string = '';
	isOpen: boolean = false;
	onChange: any = () => {};
	onTouched: any = () => {};

	constructor(private elementRef: ElementRef) {}

	ngOnInit(): void {
		// Si hay un valor inicial, establecer la etiqueta correspondiente
		if (this.selectedValue) {
			this.updateSelectedLabel();
		}
	}

	writeValue(value: string): void {
		this.selectedValue = value;
		this.updateSelectedLabel();
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	toggleDropdown(): void {
		if (!this.disabled) {
			this.isOpen = !this.isOpen;
			this.onTouched();
		}
	}

	selectOption(option: SelectOption): void {
		if (this.disabled) return;

		this.selectedValue = option.value;
		this.selectedLabel = option.label;
		this.onChange(this.selectedValue);
		this.onTouched();
		this.selectionChange.emit(this.selectedValue);

		// Cerrar inmediatamente después de seleccionar
		this.isOpen = false;
	}

	closeDropdown(): void {
		this.isOpen = false;
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: Event): void {
		// Solo cerrar si el clic no es en el componente o en el dropdown
		const target = event.target as HTMLElement;
		const isClickInsideComponent =
			this.elementRef.nativeElement.contains(target);
		const isClickOnDropdown = target.closest('.dropdown-options');

		if (!isClickInsideComponent && !isClickOnDropdown) {
			this.closeDropdown();
		}
	}

	private updateSelectedLabel(): void {
		const option = this.options.find((opt) => opt.value === this.selectedValue);
		this.selectedLabel = option ? option.label : '';
	}

	get displayValue(): string {
		return this.selectedLabel || this.placeholder;
	}
}
