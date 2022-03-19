import type App from '../app';
import { State } from '../app';

export function TrackState(key: keyof State) {
   return function(_target: App, _propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = function(...args: unknown[]) {
         const App = this as App;
         App.setState((state) => ({
            ...state,
            [key]: true
         }));

         return originalMethod.apply(this, args)
            .then(() => {
               App.setState((state) => ({
                  ...state,
                  [key]: false
               }));
            });
      };
   };
}
