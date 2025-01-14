import * as THREE from 'three'
import * as React from 'react'

type PointMaterialType = JSX.IntrinsicElements['pointsMaterial']

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointMaterialImpl: PointMaterialType
    }
  }
}

export class PointMaterialImpl extends THREE.PointsMaterial {
  constructor(props) {
    super(props)
    this.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `
        #include <output_fragment>
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      float delta = fwidth(r);     
      float mask = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
      gl_FragColor = vec4(gl_FragColor.rgb, mask * gl_FragColor.a );
      `
      )
    }
  }
}

export const PointMaterial = React.forwardRef((props, ref) => {
  const [material] = React.useState(() => new PointMaterialImpl(null))
  return <primitive object={material} ref={ref} attach="material" {...props} />
})
