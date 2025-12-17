export default function PlanesSection() {
  return (
    <div className="row">
      <div className="col-12">
        <h3>Planes</h3>
        
        <div className="Planes" id="basicPlan">
          <div id="placeholder-plan"></div>
          <p className="Planes-abajo">Consta en likes limitados, máximo 20 por día</p>
          <p className="Planes-abajo">____________________________________________</p>
          <div className="Button-Plan">
            <p className="Planess">Plan Básico (Actual)</p>
          </div>
        </div>

        <div className="Planes" id="VIPPlan">
          <div id="placeholder-plan"></div>
          <p className="Planes-abajo">Consta en likes limitados, máximo 50 por día</p>
          <p className="Planes-abajo">____________________________________________</p>
          <div className="Button-Plan">
            <p className="Planess">Plan VIP (Actualizar)</p>
          </div>
        </div>

        <div className="Planes" id="SuperVIPPlan">
          <div id="placeholder-plan"></div>
          <p className="Planes-abajo">Consta en likes ilimitados</p>
          <p className="Planes-abajo">____________________________________________</p>
          <div className="Button-Plan">
            <p className="Planess">Plan Súper-VIP (Actualizar)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
