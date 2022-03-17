import type App from '../app';

export function TrackLoadingState() {
   return function(_target: App, _propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = function(...args: unknown[]) {
         console.log(this);
         const App = this as App;
         App.setState({ loading: true });

         return originalMethod.apply(this, args).then(() => App.setState({ loading: false }));
      };
   };
}
