import { Component, OnInit } from "@angular/core";
import { AppDomains } from "../models/app.model";
import { StateService } from "../services/state.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  domains: AppDomains[];
  closeResult: string;

  form = new FormGroup({
    serverUrl: new FormControl("")
  });

  modalForm = new FormGroup({
    title: new FormControl("", Validators.required),
    id: new FormControl({ value: "", disabled: true }, Validators.required),
    code: new FormControl({ value: "", disabled: true }, Validators.required)
  });

  constructor(
    private stateService: StateService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.domains = this.stateService.domains;
  }

  get serverUrl() {
    return this.form.get("serverUrl");
  }
  get title() {
    return this.modalForm.get("title");
  }
  get id() {
    return this.modalForm.get("id");
  }
  get code() {
    return this.modalForm.get("code");
  }

  open(content, domain) {
    const url = this.serverUrl.value;
    console.log("url :", url);
    this.title.setValue(domain.title);
    this.id.setValue(domain.id);
    this.code.setValue(
      `<script async src="${url}/tracker.js" data-ackee-server="${url}" data-ackee-domain-id="${domain.id}"></script>`
    );
    this.modalService
      .open(content, { windowClass: "dark-modal", centered: true })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
