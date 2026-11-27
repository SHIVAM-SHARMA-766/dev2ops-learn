// VmVsContainer — two stacks built up per step. A VM carries its own OS (tall,
// few); containers share the host kernel (light, many). Driven by activeStep.
import React from 'react';

function Block({ show, tone, children, wide }) {
  return (
    <div className={`vmc-block vmc-block--${tone} ${wide ? 'is-wide' : ''} ${show ? 'is-in' : 'is-out'}`}>
      {children}
    </div>
  );
}

export default function VmVsContainer({ activeStep = 0 }) {
  const s = activeStep;
  return (
    <div className="w-vmc">
      {/* Virtual machines */}
      <div className="vmc-col">
        <div className="vmc-col__title mono">Virtual machines</div>
        <div className="vmc-col__stack">
          <div className="vmc-row">
            <Block show={s >= 1} tone="guest">
              <b>Guest OS</b><span>+ app</span>
            </Block>
            <Block show={s >= 2} tone="guest">
              <b>Guest OS</b><span>+ app</span>
            </Block>
          </div>
          <Block show={s >= 1} tone="infra" wide>Hypervisor</Block>
          <Block show={s >= 0} tone="hw" wide>Hardware</Block>
        </div>
        <div className="vmc-col__note mono">own kernel each · heavy · few</div>
      </div>

      {/* Containers */}
      <div className="vmc-col">
        <div className="vmc-col__title mono">Containers</div>
        <div className="vmc-col__stack">
          <div className="vmc-row">
            <Block show={s >= 3} tone="cont">app</Block>
            <Block show={s >= 3} tone="cont">app</Block>
            <Block show={s >= 3} tone="cont">app</Block>
            <Block show={s >= 4} tone="cont">app</Block>
          </div>
          <Block show={s >= 3} tone="kernel" wide>Shared host kernel</Block>
          <Block show={s >= 0} tone="hw" wide>Hardware</Block>
        </div>
        <div className="vmc-col__note mono">one shared kernel · light · many</div>
      </div>
    </div>
  );
}
