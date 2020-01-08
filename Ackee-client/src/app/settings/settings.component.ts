import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { AppDomains } from "../models/app.model";
import { Modal, State } from "../models/app.enum";
import { HttpService } from "../services/http.service";
import { StateService } from "../services/state.service";
import { BaseComponent } from "../shared/base/base.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent extends BaseComponent implements OnInit {
  domains: AppDomains[];
  Modal = Modal;
  closeResult: string;
  typing: boolean = false;

  form = new FormGroup({
    trackerName: new FormControl({ value: "", disabled: true })
  });

  modalForm = new FormGroup({
    title: new FormControl("", Validators.required),
    id: new FormControl({ value: "", disabled: true }, Validators.required),
    code: new FormControl({ value: "", disabled: true }, Validators.required)
  });

  constructor(
    private stateService: StateService,
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.domains = this.stateService.domains;
    this.httpService
      .getTrackerName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(trackerName => {
        this.trackerName.setValue(`Tracker Name: ${trackerName.name}`);
        this.stateService.loading$.next(false);
      });
  }

  get trackerName() {
    return this.form.get("trackerName");
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

  open(content: any, domain?: AppDomains) {
    if (domain) {
      const url = environment.url;
      this.title.setValue(domain.title);
      this.id.setValue(domain.id);
      this.code.setValue(
        `<script async src="${url}/${this.trackerName.value.replace(
          "Tracker Name: ",
          ""
        )}.js" data-ackee-server="${url}" data-ackee-domain-id="${
          domain.id
        }"></script>`
      );
    } else {
      this.title.setValue("");
    }
    this.modalService
      .open(content, { windowClass: "dark-modal", centered: true })
      .result.then(
        async result => {
          if (result === Modal.delete) {
            const r = confirm(
              `Are you sure you want to delete the domain "${domain.title}"? This action cannot be undone.`
            );
            if (r === true) {
              this.stateService.loading$.next(true);
              await this.httpService.deleteDomain(domain.id).toPromise();
              this.stateService.domains = this.stateService.domains.filter(
                el => el.id !== domain.id
              );
              this.domains = this.stateService.domains;
              this.stateService.loading$.next(false);
            }
          } else if (result === Modal.rename) {
            this.stateService.loading$.next(true);
            await this.httpService
              .renameDomain(domain.id, this.title.value)
              .toPromise();
            this.stateService.domains.forEach(el => {
              if (el.id === domain.id) {
                el.title = this.title.value;
                this.domains = this.stateService.domains;
              }
            });
            this.stateService.loading$.next(false);
          } else if (result === Modal.add) {
            this.stateService.loading$.next(true);
            const newDomain = await this.httpService
              .addDomain(this.title.value)
              .toPromise();
            this.stateService.domains.push({
              id: newDomain.data.id,
              title: newDomain.data.title
            });
            this.stateService.loading$.next(false);
          }
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

  logOut(): void {
    localStorage.removeItem("token");
    this.stateService.state$.next(State.login);
  }
}
