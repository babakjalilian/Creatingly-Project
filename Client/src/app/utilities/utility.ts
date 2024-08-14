import { Type } from "@angular/core";
import { ButtonComponent } from "../components/design-tools/button/button.component";
import { SearchBarComponent } from "../components/design-tools/search-bar/search-bar.component";
import { TextFieldComponent } from "../components/design-tools/text-field/text-field.component";
import { TopBarComponent } from "../components/design-tools/top-bar/top-bar.component";

export class Utility {

  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }


  static componentTypeResolver(type: string): Type<unknown> {
    return Utility.getComponentList().get(type) ?? SearchBarComponent;
  }

  static getComponentList(): Map<string, Type<unknown>> {
    const componentMapRegistery = new Map<string, Type<unknown>>();
    componentMapRegistery.set('search-bar', SearchBarComponent);
    componentMapRegistery.set('top-bar', TopBarComponent);
    componentMapRegistery.set('text-field', TextFieldComponent);
    componentMapRegistery.set('button', ButtonComponent);
    return componentMapRegistery;
  }

}
